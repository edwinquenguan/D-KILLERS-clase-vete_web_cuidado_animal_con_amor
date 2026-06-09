package com.vet.dto;

import com.vet.model.Servicio;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class MascotaRequest {

    @NotBlank
    private String nombre;
    private String raza;
    private Integer anios;
    // Tipo de consulta: servicio del catalogo
    private Servicio servicio;
    private LocalDateTime fechahoraIngreso;
    private LocalDateTime fechahoraSalida;
    private Long duenoId;
    // Opcional: en el alta el turno se asigna automaticamente; solo se usa al editar
    // para conservar el turno ya asignado a la mascota.
    private Long turnoId;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getRaza() {
        return raza;
    }

    public void setRaza(String raza) {
        this.raza = raza;
    }

    public Integer getAnios() {
        return anios;
    }

    public void setAnios(Integer anios) {
        this.anios = anios;
    }

    public Servicio getServicio() {
        return servicio;
    }

    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
    }

    public LocalDateTime getFechahoraIngreso() {
        return fechahoraIngreso;
    }

    public void setFechahoraIngreso(LocalDateTime fechahoraIngreso) {
        this.fechahoraIngreso = fechahoraIngreso;
    }

    public LocalDateTime getFechahoraSalida() {
        return fechahoraSalida;
    }

    public void setFechahoraSalida(LocalDateTime fechahoraSalida) {
        this.fechahoraSalida = fechahoraSalida;
    }

    public Long getDuenoId() {
        return duenoId;
    }

    public void setDuenoId(Long duenoId) {
        this.duenoId = duenoId;
    }

    public Long getTurnoId() {
        return turnoId;
    }

    public void setTurnoId(Long turnoId) {
        this.turnoId = turnoId;
    }
}
