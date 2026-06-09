package com.vet.e2e.runners;

import com.vet.e2e.questions.DuenosListados;
import com.vet.e2e.tasks.NavegarADuenos;
import com.vet.e2e.tasks.RegistrarDueno;
import net.serenitybdd.junit5.SerenityJUnit5Extension;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.ensure.Ensure;
import net.thucydides.core.annotations.Managed;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.WebDriver;

/**
 * Prueba E2E con Serenity BDD + patron Screenplay.
 * Requiere el frontend y backend levantados (docker compose up).
 */
@ExtendWith(SerenityJUnit5Extension.class)
class GestionDuenosTest {

    @Managed(driver = "chrome")
    WebDriver hisBrowser;

    Actor recepcionista;

    @BeforeEach
    void prepararActor() {
        recepcionista = Actor.named("Recepcionista")
                .whoCan(BrowseTheWeb.with(hisBrowser));
    }

    @Test
    @DisplayName("El recepcionista registra un dueno y lo ve en la lista")
    void registrarYVerDueno() {
        String documento = "DOC-" + System.currentTimeMillis();

        recepcionista.attemptsTo(
                NavegarADuenos.enElNavegador(),
                RegistrarDueno.conDatos("Ana Prueba", documento)
        );

        recepcionista.attemptsTo(
                Ensure.that(DuenosListados.textoDeLaTabla()).contains("Ana Prueba")
        );
    }
}
