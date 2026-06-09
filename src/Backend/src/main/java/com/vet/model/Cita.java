package com.vet.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cita")
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mascota_id", nullable = false)
    @JsonIgnoreProperties("turno")
    private Mascota mascota;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Servicio servicio;

    @Column(name = "fecha_hora_programada")
    private LocalDateTime fechaHoraProgramada;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCita estado = EstadoCita.SOLICITADA;

    @Column(name = "fecha_solicitud")
    private LocalDateTime fechaSolicitud;

    @Column(name = "fecha_terminado")
    private LocalDateTime fechaTerminado;

    @Column(name = "notificado_cliente", nullable = false)
    private boolean notificadoCliente = false;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mascota getMascota() {
        return mascota;
    }

    public void setMascota(Mascota mascota) {
        this.mascota = mascota;
    }

    public Servicio getServicio() {
        return servicio;
    }

    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
    }

    public LocalDateTime getFechaHoraProgramada() {
        return fechaHoraProgramada;
    }

    public void setFechaHoraProgramada(LocalDateTime fechaHoraProgramada) {
        this.fechaHoraProgramada = fechaHoraProgramada;
    }

    public EstadoCita getEstado() {
        return estado;
    }

    public void setEstado(EstadoCita estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(LocalDateTime fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    public LocalDateTime getFechaTerminado() {
        return fechaTerminado;
    }

    public void setFechaTerminado(LocalDateTime fechaTerminado) {
        this.fechaTerminado = fechaTerminado;
    }

    public boolean isNotificadoCliente() {
        return notificadoCliente;
    }

    public void setNotificadoCliente(boolean notificadoCliente) {
        this.notificadoCliente = notificadoCliente;
    }
}
