package com.vet.dto;

import com.vet.model.Cita;

import java.time.LocalDateTime;

/** Aviso para la campana del cliente cuando un servicio termina. */
public record NotificacionDTO(Long citaId, String mensaje, LocalDateTime fecha) {

    public static NotificacionDTO de(Cita c) {
        String servicio = c.getServicio() != null ? c.getServicio().getLabel() : "Servicio";
        String mascota = c.getMascota() != null ? c.getMascota().getNombre() : "tu mascota";
        return new NotificacionDTO(
                c.getId(),
                "El servicio \"" + servicio + "\" para " + mascota + " ha finalizado.",
                c.getFechaTerminado());
    }
}
