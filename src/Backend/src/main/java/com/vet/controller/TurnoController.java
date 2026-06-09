package com.vet.controller;

import com.vet.model.Turno;
import com.vet.service.TurnoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turnos")
public class TurnoController {

    private final TurnoService service;

    public TurnoController(TurnoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Turno> listar() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Turno obtener(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Turno> crear(@Valid @RequestBody Turno turno) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(turno));
    }

    @PutMapping("/{id}")
    public Turno actualizar(@PathVariable Long id, @Valid @RequestBody Turno turno) {
        return service.update(id, turno);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
