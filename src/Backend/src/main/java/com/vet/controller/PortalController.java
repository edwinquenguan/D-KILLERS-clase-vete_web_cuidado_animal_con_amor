package com.vet.controller;

import com.vet.dto.CitaRequest;
import com.vet.dto.MascotaRequest;
import com.vet.dto.NotificacionDTO;
import com.vet.model.Cita;
import com.vet.model.Mascota;
import com.vet.model.Usuario;
import com.vet.service.CitaService;
import com.vet.service.MascotaService;
import com.vet.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portal")
public class PortalController {

    private final UsuarioService usuarioService;
    private final MascotaService mascotaService;
    private final CitaService citaService;

    public PortalController(UsuarioService usuarioService, MascotaService mascotaService, CitaService citaService) {
        this.usuarioService = usuarioService;
        this.mascotaService = mascotaService;
        this.citaService = citaService;
    }

    private Long duenoId(UserDetails user) {
        Usuario usuario = usuarioService.porEmail(user.getUsername());
        if (usuario.getDueno() == null) {
            throw new IllegalStateException("El usuario no tiene un dueño asociado");
        }
        return usuario.getDueno().getId();
    }

    // --- Perfil ---
    @GetMapping("/perfil")
    public Map<String, Object> perfil(@AuthenticationPrincipal UserDetails user) {
        Usuario u = usuarioService.porEmail(user.getUsername());
        return Map.of("email", u.getEmail(), "nombre", u.getNombre(),
                "duenoId", u.getDueno() != null ? u.getDueno().getId() : -1);
    }

    // --- Mascotas del cliente ---
    @GetMapping("/mascotas")
    public List<Mascota> misMascotas(@AuthenticationPrincipal UserDetails user) {
        return mascotaService.deDueno(duenoId(user));
    }

    @PostMapping("/mascotas")
    public ResponseEntity<Mascota> crearMascota(@AuthenticationPrincipal UserDetails user,
                                                @Valid @RequestBody MascotaRequest req) {
        req.setDuenoId(duenoId(user)); // forzar que sea del cliente autenticado
        return ResponseEntity.status(HttpStatus.CREATED).body(mascotaService.create(req));
    }

    // --- Citas del cliente ---
    @GetMapping("/citas")
    public List<Cita> misCitas(@AuthenticationPrincipal UserDetails user) {
        return citaService.deDueno(duenoId(user));
    }

    @PostMapping("/citas")
    public ResponseEntity<Cita> agendar(@AuthenticationPrincipal UserDetails user,
                                        @Valid @RequestBody CitaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(citaService.agendar(duenoId(user), req));
    }

    @PutMapping("/citas/{id}/cancelar")
    public Cita cancelar(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        return citaService.cancelar(duenoId(user), id);
    }

    // --- Notificaciones (campana) ---
    @GetMapping("/notificaciones")
    public List<NotificacionDTO> notificaciones(@AuthenticationPrincipal UserDetails user) {
        return citaService.notificaciones(duenoId(user));
    }

    @PostMapping("/notificaciones/marcar-leidas")
    public ResponseEntity<Void> marcarLeidas(@AuthenticationPrincipal UserDetails user) {
        citaService.marcarNotificadas(duenoId(user));
        return ResponseEntity.noContent().build();
    }
}
