package com.vet.controller;

import com.vet.dto.ServicioDTO;
import com.vet.model.Servicio;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    @GetMapping
    public List<ServicioDTO> listar() {
        return Arrays.stream(Servicio.values()).map(ServicioDTO::de).toList();
    }
}
