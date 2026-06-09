package com.vet;

import com.vet.model.Dueno;
import com.vet.repository.DuenoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class DuenoRepositoryTest {

    @DynamicPropertySource
    static void h2Props(DynamicPropertyRegistry registry) {
        registry.add("spring.jpa.properties.hibernate.dialect",
                () -> "org.hibernate.dialect.H2Dialect");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
    }

    @Autowired
    private DuenoRepository repository;

    @Test
    void guardaYRecuperaDueno() {
        Dueno dueno = new Dueno();
        dueno.setNombre("Ana Perez");
        dueno.setDocumento("123456");
        dueno.setTipoDocumento("CC");

        Dueno guardado = repository.save(dueno);

        assertThat(guardado.getId()).isNotNull();
        assertThat(repository.existsByDocumento("123456")).isTrue();
    }
}
