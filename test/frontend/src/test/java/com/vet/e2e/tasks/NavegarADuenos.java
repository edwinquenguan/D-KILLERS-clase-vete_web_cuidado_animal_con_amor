package com.vet.e2e.tasks;

import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Open;

/**
 * Tarea Screenplay: abrir la seccion de Duenos del frontend.
 */
public class NavegarADuenos {

    public static Performable enElNavegador() {
        return Task.where("{0} abre la pagina de Duenos",
                Open.url("http://localhost/duenos"));
    }
}
