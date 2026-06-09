package com.vet;

import com.vet.dto.FilaItem;
import com.vet.dto.MascotaRequest;
import com.vet.model.Dueno;
import com.vet.model.Mascota;
import com.vet.model.Servicio;
import com.vet.repository.DuenoRepository;
import com.vet.service.MascotaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class MascotaServiceTest {

    @DynamicPropertySource
    static void h2Props(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url",
                () -> "jdbc:h2:mem:vettest;DB_CLOSE_DELAY=-1;MODE=MySQL");
        registry.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");
        registry.add("spring.datasource.username", () -> "sa");
        registry.add("spring.datasource.password", () -> "");
        registry.add("spring.jpa.properties.hibernate.dialect",
                () -> "org.hibernate.dialect.H2Dialect");
    }

    @Autowired
    private MascotaService mascotaService;

    @Autowired
    private DuenoRepository duenoRepository;

    private Dueno nuevoDueno(String nombre, String doc) {
        Dueno dueno = new Dueno();
        dueno.setNombre(nombre);
        dueno.setDocumento(doc);
        return duenoRepository.save(dueno);
    }

    private MascotaRequest pedido(String nombre, Long duenoId, Servicio servicio) {
        MascotaRequest req = new MascotaRequest();
        req.setNombre(nombre);
        req.setDuenoId(duenoId);
        req.setServicio(servicio);
        return req;
    }

    @Test
    void creaMascotaAsociadaADueno() {
        Dueno dueno = nuevoDueno("Carlos", "999");

        Mascota creada = mascotaService.create(pedido("Firulais", dueno.getId(), Servicio.CONSULTA_MEDICA));

        assertThat(creada.getId()).isNotNull();
        assertThat(creada.getDueno().getNombre()).isEqualTo("Carlos");
    }

    @Test
    void consecutivoEsPorServicio() {
        Dueno d1 = nuevoDueno("Ana", "111");
        Dueno d2 = nuevoDueno("Beto", "222");

        Mascota m1 = mascotaService.create(pedido("Lassie", d1.getId(), Servicio.VACUNACION));
        Mascota m2 = mascotaService.create(pedido("Toby", d2.getId(), Servicio.VACUNACION));

        assertThat(m1.getTurno().getCodigo()).isEqualTo("VAC-1");
        assertThat(m2.getTurno().getCodigo()).isEqualTo("VAC-2");
        // El primero en cola no espera; el segundo acumula la espera del anterior
        assertThat(m1.getTurno().getTiempoDeEspera()).isEqualTo(0);
        assertThat(m2.getTurno().getTiempoDeEspera()).isGreaterThan(0);
    }

    @Test
    void urgenciaEsPrioritariaYVaPrimeroEnLaFila() {
        Dueno d1 = nuevoDueno("Ana", "111");
        Dueno d2 = nuevoDueno("Beto", "222");

        // Primero llega un turno normal, luego una urgencia
        mascotaService.create(pedido("Normalito", d1.getId(), Servicio.BANO));
        Mascota urgencia = mascotaService.create(pedido("Urgente", d2.getId(), Servicio.URGENCIA_MEDICA));

        assertThat(urgencia.getTurno().getPrioritario()).isTrue();
        assertThat(urgencia.getTurno().getCodigo()).isEqualTo("URG-1");

        List<FilaItem> fila = mascotaService.filaDeEspera();
        // La urgencia debe quedar en la posicion 1 aunque haya llegado despues
        assertThat(fila.get(0).mascota()).isEqualTo("Urgente");
        assertThat(fila.get(0).prioritario()).isTrue();
    }

    @Test
    void rechazaMascotaSinDueno() {
        assertThatThrownBy(() -> mascotaService.create(pedido("SinDueno", null, Servicio.BANO)))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void rechazaMascotaSinServicio() {
        Dueno dueno = nuevoDueno("Carlos", "999");
        assertThatThrownBy(() -> mascotaService.create(pedido("SinServicio", dueno.getId(), null)))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
