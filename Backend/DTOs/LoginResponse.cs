namespace SkullShakes.Api.DTOs;

public record LoginResponse(
    string AccessToken,
    DateTime AccessTokenExpiry,
    string RefreshToken,
    DateTime RefreshTokenExpiry
);
