package com.vet.repository;

import com.vet.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MascotaRepository extends JpaRepository<Mascota, Long> {

    /**
     * Mascotas que estan en la fila de espera (su turno sigue pendiente), ordenadas
     * con las urgencias primero y luego por orden de llegada.
     */
    List<Mascota> findByTurnoDisponibilidadTrueOrderByTurnoPrioritarioDescFechahoraIngresoAsc();

    List<Mascota> findByDuenoId(Long duenoId);
}
