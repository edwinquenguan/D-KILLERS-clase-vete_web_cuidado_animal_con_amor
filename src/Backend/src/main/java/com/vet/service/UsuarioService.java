package com.vet.service;

import com.vet.dto.AuthResponse;
import com.vet.dto.LoginRequest;
import com.vet.dto.RegisterRequest;
import com.vet.model.Dueno;
import com.vet.model.Rol;
import com.vet.model.Usuario;
import com.vet.repository.DuenoRepository;
import com.vet.repository.UsuarioRepository;
import com.vet.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final DuenoRepository duenoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public UsuarioService(UsuarioRepository usuarioRepository, DuenoRepository duenoRepository,
                          PasswordEncoder passwordEncoder, JwtService jwtService,
                          AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.duenoRepository = duenoRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse registrar(RegisterRequest req) {
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        if (duenoRepository.existsByDocumento(req.getDocumento())) {
            throw new IllegalArgumentException("El documento ya está registrado");
        }

        // Crea el Dueño asociado al cliente
        Dueno dueno = new Dueno();
        dueno.setNombre(req.getNombre());
        dueno.setContacto(req.getContacto());
        dueno.setDireccion(req.getDireccion());
        dueno.setTipoDocumento(req.getTipoDocumento());
        dueno.setDocumento(req.getDocumento());
        dueno = duenoRepository.save(dueno);

        Usuario usuario = new Usuario();
        usuario.setEmail(req.getEmail());
        usuario.setPassword(passwordEncoder.encode(req.getPassword()));
        usuario.setNombre(req.getNombre());
        usuario.setRol(Rol.CLIENTE);
        usuario.setDueno(dueno);
        usuario = usuarioRepository.save(usuario);

        return token(usuario);
    }

    public AuthResponse login(LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        } catch (Exception e) {
            throw new BadCredentialsException("Credenciales inválidas");
        }
        Usuario usuario = usuarioRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));
        return token(usuario);
    }

    public Usuario porEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuario no encontrado: " + email));
    }

    private AuthResponse token(Usuario usuario) {
        Long duenoId = usuario.getDueno() != null ? usuario.getDueno().getId() : null;
        String jwt = jwtService.generar(usuario.getEmail(),
                Map.of("rol", usuario.getRol().name(), "duenoId", duenoId != null ? duenoId : -1));
        return new AuthResponse(jwt, usuario.getEmail(), usuario.getNombre(), usuario.getRol().name(), duenoId);
    }
}
