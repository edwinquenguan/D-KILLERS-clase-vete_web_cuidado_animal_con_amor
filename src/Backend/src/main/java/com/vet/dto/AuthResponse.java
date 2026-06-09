package com.vet.dto;

/** Respuesta de login/registro: token JWT + datos basicos de sesion. */
public record AuthResponse(String token, String email, String nombre, String rol, Long duenoId) {
}
