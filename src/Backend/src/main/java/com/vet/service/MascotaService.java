package com.vet.service;

import com.vet.config.ResourceNotFoundException;
import com.vet.dto.FilaItem;
import com.vet.dto.MascotaRequest;
import com.vet.model.Mascota;
import com.vet.repository.MascotaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MascotaService {

    private final MascotaRepository repository;
    private final DuenoService duenoService;
    private final TurnoService turnoService;

    public MascotaService(MascotaRepository repository, DuenoService duenoService, TurnoService turnoService) {
        this.repository = repository;
        this.duenoService = duenoService;
        this.turnoService = turnoService;
    }

    public List<Mascota> findAll() {
        return repository.findAll();
    }

    public List<Mascota> deDueno(Long duenoId) {
        return repository.findByDuenoId(duenoId);
    }

    /**
     * Fila de espera ordenada (urgencias primero, luego por llegada). El tiempo estimado
     * se calcula en vivo segun la posicion, reflejando la prioridad actual de la cola.
     */
    public List<FilaItem> filaDeEspera() {
        List<Mascota> enCola =
                repository.findByTurnoDisponibilidadTrueOrderByTurnoPrioritarioDescFechahoraIngresoAsc();
        List<FilaItem> fila = new java.util.ArrayList<>();
        for (int i = 0; i < enCola.size(); i++) {
            fila.add(FilaItem.de(enCola.get(i), i + 1, i * TurnoService.ATENCION_BASE_MIN));
        }
        return fila;
    }

    public Mascota findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mascota no encontrada: " + id));
    }

    @Transactional
    public Mascota create(MascotaRequest req) {
        Mascota mascota = new Mascota();
        aplicar(mascota, req);
        // Fecha de ingreso automatica si no se envia
        if (mascota.getFechahoraIngreso() == null) {
            mascota.setFechahoraIngreso(LocalDateTime.now());
        }
        // El turno se asigna automaticamente generando el siguiente de la cola del servicio
        if (mascota.getTurno() == null) {
            mascota.setTurno(turnoService.generarSiguiente(mascota.getServicio()));
        }
        return repository.save(mascota);
    }

    @Transactional
    public Mascota update(Long id, MascotaRequest req) {
        Mascota mascota = findById(id);
        aplicar(mascota, req);
        // Al registrar la salida, el turno se cierra (sale de la cola)
        if (mascota.getFechahoraSalida() != null) {
            turnoService.cerrar(mascota.getTurno());
        }
        return repository.save(mascota);
    }

    @Transactional
    public void delete(Long id) {
        Mascota mascota = findById(id);
        repository.delete(mascota);
    }

    private void aplicar(Mascota mascota, MascotaRequest req) {
        if (req.getDuenoId() == null) {
            throw new IllegalArgumentException("La mascota debe tener un dueno asignado");
        }
        if (req.getServicio() == null) {
            throw new IllegalArgumentException("Debe seleccionar un servicio (tipo de consulta)");
        }
        mascota.setNombre(req.getNombre());
        mascota.setRaza(req.getRaza());
        mascota.setAnios(req.getAnios());
        mascota.setServicio(req.getServicio());
        if (req.getFechahoraIngreso() != null) {
            mascota.setFechahoraIngreso(req.getFechahoraIngreso());
        }
        mascota.setFechahoraSalida(req.getFechahoraSalida());
        mascota.setDueno(duenoService.findById(req.getDuenoId()));
        // turnoId solo se usa al editar para conservar el turno ya asignado
        if (req.getTurnoId() != null) {
            mascota.setTurno(turnoService.findById(req.getTurnoId()));
        }
    }
}
