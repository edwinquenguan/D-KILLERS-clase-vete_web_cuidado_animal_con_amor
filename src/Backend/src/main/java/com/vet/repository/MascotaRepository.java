package com.vet.repository;

import com.vet.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MascotaRepository extends JpaRepository<Mascota, Long> {

    List<Mascota> findByActivoTrue();

    List<Mascota> findByActivoTrueAndTurnoDisponibilidadTrueOrderByTurnoPrioritarioDescFechahoraIngresoAsc();

    List<Mascota> findByDuenoIdAndActivoTrue(Long duenoId);
}
