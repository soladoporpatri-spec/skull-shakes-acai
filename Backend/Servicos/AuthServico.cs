using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SkullShakes.Api.BancoDeDados;
using SkullShakes.Api.DTOs;
using SkullShakes.Api.Modelos;

namespace SkullShakes.Api.Servicos;

public class AuthServico
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly PasswordHasher<AdminUser> _hasher = new();
    private readonly ILogger<AuthServico> _logger;

    public AuthServico(AppDbContext db, IConfiguration config, ILogger<AuthServico> logger)
    {
        _db = db;
        _config = config;
        _logger = logger;
    }

    public async Task<LoginResponse?> LoginAsync(string username, string password, string? deviceInfo)
    {
        var user = await _db.AdminUsers
            .FirstOrDefaultAsync(u => u.Username == username && u.IsActive);

        if (user is null)
        {
            _logger.LogWarning("Login attempt for unknown user: {Username}", username);
            return null;
        }

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, password);
        if (result == PasswordVerificationResult.Failed)
        {
            _logger.LogWarning("Failed login attempt for user: {Username}", username);
            return null;
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return await GerarTokensAsync(user, deviceInfo);
    }

    public async Task<LoginResponse?> RefreshAsync(string rawRefreshToken, string? deviceInfo)
    {
        var tokenHash = HashToken(rawRefreshToken);

        var storedToken = await _db.RefreshTokens
            .Include(t => t.AdminUser)
            .FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

        if (storedToken is null)
        {
            _logger.LogWarning("Refresh attempt with unknown token");
            return null;
        }

        if (storedToken.IsRevoked)
        {
            _logger.LogWarning("SECURITY: Rotated refresh token reused. Revoking family {Family}", storedToken.Family);
            await RevogarFamiliaAsync(storedToken.Family);
            return null;
        }

        if (storedToken.ExpiresAt < DateTime.UtcNow)
        {
            _logger.LogInformation("Expired refresh token for user {UserId}", storedToken.AdminUserId);
            return null;
        }

        storedToken.IsRevoked = true;
        await _db.SaveChangesAsync();

        return await GerarTokensAsync(storedToken.AdminUser, deviceInfo, storedToken.Family);
    }

    public async Task LogoutAsync(string rawRefreshToken)
    {
        var tokenHash = HashToken(rawRefreshToken);
        var storedToken = await _db.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == tokenHash);
        if (storedToken is not null)
        {
            storedToken.IsRevoked = true;
            await _db.SaveChangesAsync();
            _logger.LogInformation("User {UserId} logged out", storedToken.AdminUserId);
        }
    }

    private async Task RevogarFamiliaAsync(string family)
    {
        var tokens = await _db.RefreshTokens.Where(t => t.Family == family).ToListAsync();
        foreach (var t in tokens) t.IsRevoked = true;
        await _db.SaveChangesAsync();
    }

    private async Task<LoginResponse> GerarTokensAsync(AdminUser user, string? deviceInfo, string? family = null)
    {
        var accessToken = GerarAccessToken(user);
        var accessExpiry = DateTime.UtcNow.AddMinutes(15);

        var rawRefresh = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var refreshExpiry = DateTime.UtcNow.AddDays(7);

        var refreshToken = new RefreshToken
        {
            AdminUserId = user.Id,
            TokenHash = HashToken(rawRefresh),
            ExpiresAt = refreshExpiry,
            DeviceInfo = deviceInfo,
            Family = family ?? Guid.NewGuid().ToString()
        };

        _db.RefreshTokens.Add(refreshToken);
        await _db.SaveChangesAsync();

        return new LoginResponse(accessToken, accessExpiry, rawRefresh, refreshExpiry);
    }

    private string GerarAccessToken(AdminUser user)
    {
        var jwtSecret = _config["JWT_SECRET"]
            ?? throw new InvalidOperationException("JWT_SECRET env var not configured.");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, "Admin")
        };

        var token = new JwtSecurityToken(
            issuer: "SkullShakes",
            audience: "SkullShakesAdmin",
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string HashToken(string rawToken)
    {
        var bytes = Encoding.UTF8.GetBytes(rawToken);
        var hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash);
    }
}
