package com.vet;

import com.vet.dto.AuthResponse;
import com.vet.dto.CitaRequest;
import com.vet.dto.MascotaRequest;
import com.vet.dto.RegisterRequest;
import com.vet.model.Cita;
import com.vet.model.EstadoCita;
import com.vet.model.Mascota;
import com.vet.model.Servicio;
import com.vet.service.CitaService;
import com.vet.service.MascotaService;
import com.vet.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class AuthCitaTest {

    @DynamicPropertySource
    static void h2Props(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url",
                () -> "jdbc:h2:mem:vetauth;DB_CLOSE_DELAY=-1;MODE=MySQL");
        registry.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");
        registry.add("spring.datasource.username", () -> "sa");
        registry.add("spring.datasource.password", () -> "");
        registry.add("spring.jpa.properties.hibernate.dialect",
                () -> "org.hibernate.dialect.H2Dialect");
    }

    @Autowired private UsuarioService usuarioService;
    @Autowired private MascotaService mascotaService;
    @Autowired private CitaService citaService;

    private RegisterRequest registro(String email, String doc) {
        RegisterRequest r = new RegisterRequest();
        r.setEmail(email);
        r.setPassword("secreto123");
        r.setNombre("Cliente Test");
        r.setDocumento(doc);
        return r;
    }

    @Test
    void registroCreaUsuarioConDuenoYTokenYPasswordHasheado() {
        AuthResponse resp = usuarioService.registrar(registro("ana@test.com", "D1"));

        assertThat(resp.token()).isNotBlank();
        assertThat(resp.rol()).isEqualTo("CLIENTE");
        assertThat(resp.duenoId()).isNotNull();
        // La contraseña no se guarda en texto plano
        assertThat(usuarioService.porEmail("ana@test.com").getPassword()).isNotEqualTo("secreto123");
    }

    @Test
    void flujoAgendarYNotificarServicioTerminado() {
        AuthResponse cliente = usuarioService.registrar(registro("beto@test.com", "D2"));
        Long duenoId = cliente.duenoId();

        // El cliente registra una mascota
        MascotaRequest mreq = new MascotaRequest();
        mreq.setNombre("Toby");
        mreq.setServicio(Servicio.CONSULTA_MEDICA);
        mreq.setDuenoId(duenoId);
        Mascota mascota = mascotaService.create(mreq);

        // Agenda una cita
        CitaRequest creq = new CitaRequest();
        creq.setMascotaId(mascota.getId());
        creq.setServicio(Servicio.CONSULTA_MEDICA);
        Cita cita = citaService.agendar(duenoId, creq);
        assertThat(cita.getEstado()).isEqualTo(EstadoCita.SOLICITADA);

        // Aun no hay notificaciones
        assertThat(citaService.notificaciones(duenoId)).isEmpty();

        // El admin marca la cita como terminada
        citaService.cambiarEstado(cita.getId(), EstadoCita.TERMINADA);

        // Ahora aparece el aviso para el cliente
        assertThat(citaService.notificaciones(duenoId)).hasSize(1);

        // Tras marcarlas leidas, ya no aparece
        citaService.marcarNotificadas(duenoId);
        assertThat(citaService.notificaciones(duenoId)).isEmpty();
    }

    @Test
    void noSePuedeAgendarParaMascotaDeOtroCliente() {
        AuthResponse c1 = usuarioService.registrar(registro("c1@test.com", "D3"));
        AuthResponse c2 = usuarioService.registrar(registro("c2@test.com", "D4"));

        MascotaRequest mreq = new MascotaRequest();
        mreq.setNombre("Lassie");
        mreq.setServicio(Servicio.BANO);
        mreq.setDuenoId(c1.duenoId());
        Mascota deC1 = mascotaService.create(mreq);

        CitaRequest creq = new CitaRequest();
        creq.setMascotaId(deC1.getId());
        creq.setServicio(Servicio.BANO);

        // c2 intenta agendar sobre la mascota de c1
        org.assertj.core.api.Assertions
                .assertThatThrownBy(() -> citaService.agendar(c2.duenoId(), creq))
                .isInstanceOf(IllegalArgumentException.class);

        List<Cita> citasC1 = citaService.deDueno(c1.duenoId());
        assertThat(citasC1).isEmpty();
    }
}
