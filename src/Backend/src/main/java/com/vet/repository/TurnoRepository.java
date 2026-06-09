package com.vet.repository;

import com.vet.model.Servicio;
import com.vet.model.Turno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TurnoRepository extends JpaRepository<Turno, Long> {

    /** Turnos pendientes en cola (aun no atendidos). */
    List<Turno> findByDisponibilidadTrue();

    /** Ultimo turno de un servicio por consecutivo, para calcular el siguiente. */
    Optional<Turno> findTopByServicioOrderByConsecutivoDesc(Servicio servicio);
}
