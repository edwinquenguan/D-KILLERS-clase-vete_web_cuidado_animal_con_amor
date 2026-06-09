package com.vet.e2e.tasks;

import com.vet.e2e.ui.DuenoForm;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;

/**
 * Tarea Screenplay: registrar un dueno diligenciando el formulario.
 */
public class RegistrarDueno implements Task {

    private final String nombre;
    private final String documento;

    public RegistrarDueno(String nombre, String documento) {
        this.nombre = nombre;
        this.documento = documento;
    }

    public static RegistrarDueno conDatos(String nombre, String documento) {
        return new RegistrarDueno(nombre, documento);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Enter.theValue(nombre).into(DuenoForm.NOMBRE),
                Enter.theValue(documento).into(DuenoForm.DOCUMENTO),
                Click.on(DuenoForm.GUARDAR)
        );
    }
}
