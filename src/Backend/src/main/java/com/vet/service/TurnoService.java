package com.vet.service;

import com.vet.config.ResourceNotFoundException;
import com.vet.model.Servicio;
import com.vet.model.Turno;
import com.vet.repository.TurnoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class TurnoService {

    /** Duracion estimada de atencion (en minutos) de cada turno en la cola. */
    public static final int ATENCION_BASE_MIN = 15;

    private final TurnoRepository repository;

    public TurnoService(TurnoRepository repository) {
        this.repository = repository;
    }

    /**
     * Genera el siguiente turno de la cola para un servicio, de forma automatica:
     * - consecutivo = ultimo consecutivo DE ESE SERVICIO + 1
     * - codigo = prefijo del servicio + "-" + consecutivo (ej. URG-1)
     * - prioritario = el servicio es una urgencia
     * - tiempoDeEspera = turnos pendientes por delante (respetando prioridad) x ATENCION_BASE_MIN
     * - disponibilidad = true (queda pendiente de atender)
     * - turno = franja del dia segun la hora actual
     */
    public Turno generarSiguiente(Servicio servicio) {
        boolean prioritario = servicio.isPrioritario();

        // Turnos pendientes que van delante: una urgencia solo espera tras otras urgencias;
        // un turno normal espera tras urgencias y normales pendientes.
        long porDelante = repository.findByDisponibilidadTrue().stream()
                .filter(t -> prioritario ? Boolean.TRUE.equals(t.getPrioritario()) : true)
                .count();
        int tiempoEspera = (int) porDelante * ATENCION_BASE_MIN;

        int consecutivo = repository.findTopByServicioOrderByConsecutivoDesc(servicio)
                .map(t -> (t.getConsecutivo() != null ? t.getConsecutivo() : 0) + 1)
                .orElse(1);

        Turno turno = new Turno();
        turno.setServicio(servicio);
        turno.setConsecutivo(consecutivo);
        turno.setCodigo(servicio.getPrefijo() + "-" + consecutivo);
        turno.setPrioritario(prioritario);
        turno.setTiempoDeEspera(tiempoEspera);
        turno.setDisponibilidad(true);
        turno.setTurno(LocalTime.now().getHour() < 12 ? "Manana" : "Tarde");
        return repository.save(turno);
    }

    /** Marca un turno como atendido (sale de la cola). */
    public void cerrar(Turno turno) {
        if (turno != null && Boolean.TRUE.equals(turno.getDisponibilidad())) {
            turno.setDisponibilidad(false);
            repository.save(turno);
        }
    }

    public List<Turno> findAll() {
        return repository.findAll();
    }

    public Turno findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado: " + id));
    }

    public Turno create(Turno turno) {
        turno.setId(null);
        return repository.save(turno);
    }

    public Turno update(Long id, Turno datos) {
        Turno turno = findById(id);
        turno.setDisponibilidad(datos.getDisponibilidad());
        turno.setTurno(datos.getTurno());
        turno.setConsecutivo(datos.getConsecutivo());
        turno.setTiempoDeEspera(datos.getTiempoDeEspera());
        return repository.save(turno);
    }

    public void delete(Long id) {
        Turno turno = findById(id);
        repository.delete(turno);
    }
}
