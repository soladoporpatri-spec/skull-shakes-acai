namespace SkullShakes.Api.Modelos;

public class RefreshToken
{
    public int Id { get; set; }
    public int AdminUserId { get; set; }
    public AdminUser AdminUser { get; set; } = null!;
    // Stored as SHA256 hash, NEVER in plaintext
    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? DeviceInfo { get; set; } // User-Agent for traceability
    // Token family: if a rotated token is reused, the entire family is revoked
    public string Family { get; set; } = string.Empty;
}
