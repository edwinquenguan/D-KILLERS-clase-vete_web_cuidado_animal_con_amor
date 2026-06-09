package com.vet.controller;

import com.vet.dto.FilaItem;
import com.vet.service.MascotaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/fila")
public class FilaController {

    private final MascotaService mascotaService;

    public FilaController(MascotaService mascotaService) {
        this.mascotaService = mascotaService;
    }

    @GetMapping
    public List<FilaItem> fila() {
        return mascotaService.filaDeEspera();
    }
}
