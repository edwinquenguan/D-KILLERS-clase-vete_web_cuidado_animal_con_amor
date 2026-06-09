package com.vet.service;

import com.vet.config.ResourceNotFoundException;
import com.vet.dto.CitaRequest;
import com.vet.dto.NotificacionDTO;
import com.vet.model.Cita;
import com.vet.model.EstadoCita;
import com.vet.model.Mascota;
import com.vet.repository.CitaRepository;
import com.vet.repository.MascotaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CitaService {

    private final CitaRepository citaRepository;
    private final MascotaRepository mascotaRepository;

    public CitaService(CitaRepository citaRepository, MascotaRepository mascotaRepository) {
        this.citaRepository = citaRepository;
        this.mascotaRepository = mascotaRepository;
    }

    public List<Cita> findAll() {
        return citaRepository.findAll();
    }

    public List<Cita> deDueno(Long duenoId) {
        return citaRepository.findByMascotaDuenoIdOrderByFechaSolicitudDesc(duenoId);
    }

    @Transactional
    public Cita agendar(Long duenoId, CitaRequest req) {
        Mascota mascota = mascotaRepository.findById(req.getMascotaId())
                .orElseThrow(() -> new ResourceNotFoundException("Mascota no encontrada: " + req.getMascotaId()));
        if (mascota.getDueno() == null || !mascota.getDueno().getId().equals(duenoId)) {
            throw new IllegalArgumentException("La mascota no pertenece al cliente");
        }
        Cita cita = new Cita();
        cita.setMascota(mascota);
        cita.setServicio(req.getServicio());
        cita.setFechaHoraProgramada(req.getFechaHoraProgramada());
        cita.setEstado(EstadoCita.SOLICITADA);
        cita.setFechaSolicitud(LocalDateTime.now());
        return citaRepository.save(cita);
    }

    @Transactional
    public Cita cambiarEstado(Long citaId, EstadoCita estado) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada: " + citaId));
        cita.setEstado(estado);
        if (estado == EstadoCita.TERMINADA) {
            cita.setFechaTerminado(LocalDateTime.now());
            cita.setNotificadoCliente(false); // dispara el aviso al cliente
        }
        return citaRepository.save(cita);
    }

    @Transactional
    public Cita cancelar(Long duenoId, Long citaId) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada: " + citaId));
        if (cita.getMascota().getDueno() == null
                || !cita.getMascota().getDueno().getId().equals(duenoId)) {
            throw new IllegalArgumentException("La cita no pertenece al cliente");
        }
        cita.setEstado(EstadoCita.CANCELADA);
        return citaRepository.save(cita);
    }

    /** Avisos pendientes (citas terminadas no notificadas) del cliente. */
    public List<NotificacionDTO> notificaciones(Long duenoId) {
        return citaRepository
                .findByMascotaDuenoIdAndEstadoAndNotificadoClienteFalse(duenoId, EstadoCita.TERMINADA)
                .stream().map(NotificacionDTO::de).toList();
    }

    @Transactional
    public void marcarNotificadas(Long duenoId) {
        List<Cita> pendientes = citaRepository
                .findByMascotaDuenoIdAndEstadoAndNotificadoClienteFalse(duenoId, EstadoCita.TERMINADA);
        pendientes.forEach(c -> c.setNotificadoCliente(true));
        citaRepository.saveAll(pendientes);
    }
}
