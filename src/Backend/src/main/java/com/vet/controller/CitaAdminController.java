package com.vet.controller;

import com.vet.model.Cita;
import com.vet.model.EstadoCita;
import com.vet.service.CitaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/citas")
public class CitaAdminController {

    private final CitaService citaService;

    public CitaAdminController(CitaService citaService) {
        this.citaService = citaService;
    }

    @GetMapping
    public List<Cita> listar() {
        return citaService.findAll();
    }

    @PutMapping("/{id}/estado")
    public Cita cambiarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        EstadoCita estado = EstadoCita.valueOf(body.get("estado"));
        return citaService.cambiarEstado(id, estado);
    }
}
