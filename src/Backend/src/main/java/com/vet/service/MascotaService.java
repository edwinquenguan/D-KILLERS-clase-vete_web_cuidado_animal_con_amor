package com.vet.service;

import com.vet.config.ResourceNotFoundException;
import com.vet.dto.FilaItem;
import com.vet.dto.MascotaRequest;
import com.vet.model.Mascota;
import com.vet.repository.MascotaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
        return repository.findByActivoTrue();
    }

    public List<Mascota> deDueno(Long duenoId) {
        return repository.findByDuenoIdAndActivoTrue(duenoId);
    }

    public List<FilaItem> filaDeEspera() {
        List<Mascota> enCola =
                repository.findByActivoTrueAndTurnoDisponibilidadTrueOrderByTurnoPrioritarioDescFechahoraIngresoAsc();
        List<FilaItem> fila = new ArrayList<>();
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
        if (mascota.getFechahoraIngreso() == null) {
            mascota.setFechahoraIngreso(LocalDateTime.now());
        }
        if (mascota.getTurno() == null) {
            mascota.setTurno(turnoService.generarSiguiente(mascota.getServicio()));
        }
        mascota.setActivo(true);
        return repository.save(mascota);
    }

    @Transactional
    public Mascota update(Long id, MascotaRequest req) {
        Mascota mascota = findById(id);
        aplicar(mascota, req);
        if (mascota.getFechahoraSalida() != null) {
            turnoService.cerrar(mascota.getTurno());
        }
        return repository.save(mascota);
    }

    @Transactional
    public void deshabilitar(Long id) {
        Mascota mascota = findById(id);
        mascota.setActivo(false);
        repository.save(mascota);
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
        mascota.setEspecie(req.getEspecie());
        mascota.setRaza(req.getRaza());
        mascota.setSexo(req.getSexo());
        mascota.setColor(req.getColor());
        mascota.setPeso(req.getPeso());
        mascota.setFechaNacimiento(req.getFechaNacimiento());
        mascota.setAnios(req.getAnios());
        mascota.setServicio(req.getServicio());
        if (req.getFechahoraIngreso() != null) {
            mascota.setFechahoraIngreso(req.getFechahoraIngreso());
        }
        mascota.setFechahoraSalida(req.getFechahoraSalida());
        mascota.setDueno(duenoService.findById(req.getDuenoId()));
        if (req.getTurnoId() != null) {
            mascota.setTurno(turnoService.findById(req.getTurnoId()));
        }
    }
}
