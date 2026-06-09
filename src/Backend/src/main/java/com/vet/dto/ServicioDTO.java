package com.vet.dto;

import com.vet.model.Servicio;

/** Representacion del catalogo de servicios para alimentar los desplegables del front. */
public record ServicioDTO(String nombre, String label, String prefijo, boolean prioritario) {

    public static ServicioDTO de(Servicio s) {
        return new ServicioDTO(s.name(), s.getLabel(), s.getPrefijo(), s.isPrioritario());
    }
}
