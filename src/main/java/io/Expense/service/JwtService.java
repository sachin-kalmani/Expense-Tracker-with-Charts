package io.Expense.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtService {

    // Secret key used for signing JWTs (must be kept safe)
    private static final String SECRET = "5367566859703373367639792F423F452848284D6251655468576D5A71347437";

    // Token expiration times (Access token - 30 minutes, Refresh token - 7 days)
    private static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 30; // 30 minutes


    // Generate access token with email and role
    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);  // Store the role in the token claims
        return createToken(claims, email, ACCESS_TOKEN_EXPIRATION);
    }

    // Create a JWT token with specific claims, subject (email), and expiration time
    private String createToken(Map<String, Object> claims, String email, long expirationTime) {
        return Jwts.builder()
                .setClaims(claims) // Add claims (role) to the token
                .setSubject(email) // Set the email as the subject of the token
                .setIssuedAt(new Date()) // Set the token issued date
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // Set expiration date
                .signWith(getSignKey(), SignatureAlgorithm.HS256) // Sign the token with the secret key
                .compact();
    }

    // Get the signing key used for creating the JWT token
    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET); // Decode the base64-encoded secret key
        return Keys.hmacShaKeyFor(keyBytes); // Return the HMAC signing key
    }

    // Extract username (email) from the token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject); // Extract the subject (email) from the token
    }

    // Extract expiration date from the token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration); // Extract the expiration date from the token
    }

    // Extract any claim from the token using a claims resolver function
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token); // Extract all claims from the token
        return claimsResolver.apply(claims); // Apply the resolver function to the claims
    }

    // Extract all claims from the token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey()) // Set the signing key for validation
                .setAllowedClockSkewSeconds(60) // Allow up to 60 seconds of clock skew
                .build()
                .parseClaimsJws(token) // Parse the token
                .getBody(); // Return the body (claims) of the parsed token
    }

    // Check if the token is expired
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date()); // Check if the token expiration date is before the current date
    }

    // Validate the token by comparing username and checking if it's expired
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token); // Extract the username (email) from the token
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token)); // Validate the token
    }

    // Extract the role from the JWT token
    public String extractRole(String token) {
        Claims claims = extractAllClaims(token); // Extract all claims from the token
        return claims.get("role", String.class); // Get the role from the claims
    }
}
