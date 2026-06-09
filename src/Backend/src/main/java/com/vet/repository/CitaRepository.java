package com.vet.repository;

import com.vet.model.Cita;
import com.vet.model.EstadoCita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    List<Cita> findByMascotaDuenoIdOrderByFechaSolicitudDesc(Long duenoId);

    List<Cita> findByEstadoOrderByFechaSolicitudDesc(EstadoCita estado);

    /** Citas terminadas de un dueño aun no avisadas (para la campana de notificaciones). */
    List<Cita> findByMascotaDuenoIdAndEstadoAndNotificadoClienteFalse(Long duenoId, EstadoCita estado);
}
