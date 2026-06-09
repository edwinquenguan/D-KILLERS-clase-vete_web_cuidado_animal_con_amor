package com.vet.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expMillis;

    public JwtService(
            @Value("${jwt.secret:cambiestaclaveultrasecretaparadesarrollo1234567890}") String secret,
            @Value("${jwt.exp-min:120}") long expMin) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expMillis = expMin * 60_000;
    }

    public String generar(String email, Map<String, Object> claims) {
        Date now = new Date();
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expMillis))
                .signWith(key)
                .compact();
    }

    public String extraerEmail(String token) {
        return extraer(token, Claims::getSubject);
    }

    public boolean esValido(String token, String email) {
        try {
            return email.equals(extraerEmail(token)) && !extraer(token, Claims::getExpiration).before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private <T> T extraer(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        return resolver.apply(claims);
    }
}
