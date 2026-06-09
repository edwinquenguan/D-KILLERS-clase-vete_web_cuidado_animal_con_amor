package com.vet.dto;

import com.vet.model.Mascota;

/** Un elemento de la fila de espera para la pantalla publica. */
public record FilaItem(
        int posicion,
        String codigoTurno,
        String servicio,
        boolean prioritario,
        String mascota,
        String dueno,
        int tiempoEstimado
) {
    public static FilaItem de(Mascota m, int posicion, int tiempoEstimado) {
        return new FilaItem(
                posicion,
                m.getTurno() != null ? m.getTurno().getCodigo() : null,
                m.getServicio() != null ? m.getServicio().getLabel() : null,
                m.getTurno() != null && Boolean.TRUE.equals(m.getTurno().getPrioritario()),
                m.getNombre(),
                m.getDueno() != null ? m.getDueno().getNombre() : null,
                tiempoEstimado
        );
    }
}
