package com.vet.dto;

import com.vet.model.Servicio;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class CitaRequest {

    @NotNull
    private Long mascotaId;
    @NotNull
    private Servicio servicio;
    private LocalDateTime fechaHoraProgramada;

    public Long getMascotaId() { return mascotaId; }
    public void setMascotaId(Long mascotaId) { this.mascotaId = mascotaId; }
    public Servicio getServicio() { return servicio; }
    public void setServicio(Servicio servicio) { this.servicio = servicio; }
    public LocalDateTime getFechaHoraProgramada() { return fechaHoraProgramada; }
    public void setFechaHoraProgramada(LocalDateTime fechaHoraProgramada) { this.fechaHoraProgramada = fechaHoraProgramada; }
}
