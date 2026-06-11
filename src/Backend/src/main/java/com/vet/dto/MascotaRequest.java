package com.vet.dto;

import com.vet.model.Servicio;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MascotaRequest {

    @NotBlank
    private String nombre;
    private String especie;
    private String raza;
    private String sexo;
    private String color;
    private Double peso;
    private LocalDate fechaNacimiento;
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

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public String getRaza() {
        return raza;
    }

    public void setRaza(String raza) {
        this.raza = raza;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Double getPeso() {
        return peso;
    }

    public void setPeso(Double peso) {
        this.peso = peso;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
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
