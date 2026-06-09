package com.vet.model;

import jakarta.persistence.*;

@Entity
@Table(name = "turno")
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Boolean disponibilidad = true;

    private String turno;

    private Integer consecutivo;

    @Column(name = "tiempo_de_espera")
    private Integer tiempoDeEspera;

    @Enumerated(EnumType.STRING)
    private Servicio servicio;

    /** Numero de turno visible, ej. "URG-1" (prefijo del servicio + consecutivo). */
    private String codigo;

    @Column(nullable = false)
    private Boolean prioritario = false;

    public Turno() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getDisponibilidad() {
        return disponibilidad;
    }

    public void setDisponibilidad(Boolean disponibilidad) {
        this.disponibilidad = disponibilidad;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public Integer getConsecutivo() {
        return consecutivo;
    }

    public void setConsecutivo(Integer consecutivo) {
        this.consecutivo = consecutivo;
    }

    public Integer getTiempoDeEspera() {
        return tiempoDeEspera;
    }

    public void setTiempoDeEspera(Integer tiempoDeEspera) {
        this.tiempoDeEspera = tiempoDeEspera;
    }

    public Servicio getServicio() {
        return servicio;
    }

    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Boolean getPrioritario() {
        return prioritario;
    }

    public void setPrioritario(Boolean prioritario) {
        this.prioritario = prioritario;
    }
}
