package com.vet.controller;

import com.vet.model.Dueno;
import com.vet.service.DuenoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/duenos")
public class DuenoController {

    private final DuenoService service;

    public DuenoController(DuenoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Dueno> listar() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Dueno obtener(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Dueno> crear(@Valid @RequestBody Dueno dueno) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dueno));
    }

    @PutMapping("/{id}")
    public Dueno actualizar(@PathVariable Long id, @Valid @RequestBody Dueno dueno) {
        return service.update(id, dueno);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
