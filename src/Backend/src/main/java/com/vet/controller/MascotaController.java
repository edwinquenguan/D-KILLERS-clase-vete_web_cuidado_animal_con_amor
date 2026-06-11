package com.vet.controller;

import com.vet.dto.MascotaRequest;
import com.vet.model.Mascota;
import com.vet.service.MascotaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    private final MascotaService service;

    public MascotaController(MascotaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Mascota> listar() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Mascota obtener(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Mascota> crear(@Valid @RequestBody MascotaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PutMapping("/{id}")
    public Mascota actualizar(@PathVariable Long id, @Valid @RequestBody MascotaRequest req) {
        return service.update(id, req);
    }

    @PutMapping("/{id}/deshabilitar")
    public ResponseEntity<Void> deshabilitar(@PathVariable Long id) {
        service.deshabilitar(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
