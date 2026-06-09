package com.vet.config;

import com.vet.model.Rol;
import com.vet.model.Usuario;
import com.vet.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Crea un usuario administrador inicial si no existe. */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public DataSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                      @Value("${admin.email:admin@vet.com}") String adminEmail,
                      @Value("${admin.password:admin123}") String adminPassword) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (!usuarioRepository.existsByEmail(adminEmail)) {
            Usuario admin = new Usuario();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setNombre("Administrador");
            admin.setRol(Rol.ADMIN);
            usuarioRepository.save(admin);
        }
    }
}
