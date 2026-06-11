package com.vet.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "mascota")
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nombre;

    private String especie;

    private String raza;

    private String sexo;

    private String color;

    private Double peso;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "anios")
    private Integer anios;

    // El "tipo de consulta" es ahora un servicio del catalogo; reusa la columna motivo_consulta.
    @Enumerated(EnumType.STRING)
    @Column(name = "motivo_consulta")
    private Servicio servicio;

    @Column(name = "fechahora_ingreso")
    private LocalDateTime fechahoraIngreso;

    @Column(name = "fechahora_salida")
    private LocalDateTime fechahoraSalida;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dueno_id")
    @JsonIgnoreProperties("mascotas")
    private Dueno dueno;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "turno_id")
    private Turno turno;

    @Column(nullable = false)
    private boolean activo = true;

    public Mascota() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Dueno getDueno() {
        return dueno;
    }

    public void setDueno(Dueno dueno) {
        this.dueno = dueno;
    }

    public Turno getTurno() {
        return turno;
    }

    public void setTurno(Turno turno) {
        this.turno = turno;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}
