package com.vet.e2e.ui;

import net.serenitybdd.screenplay.targets.Target;

/**
 * Locators (Targets) de la pagina de Duenos en el frontend React.
 */
public class DuenoForm {

    public static final Target NOMBRE = Target.the("campo nombre")
            .locatedBy("[data-testid='nombre']");

    public static final Target DOCUMENTO = Target.the("campo documento")
            .locatedBy("[data-testid='documento']");

    public static final Target GUARDAR = Target.the("boton guardar")
            .locatedBy("[data-testid='guardar']");

    public static final Target LISTA = Target.the("tabla de duenos")
            .locatedBy("[data-testid='lista-duenos']");

    public static final Target ERROR = Target.the("mensaje de error")
            .locatedBy("[data-testid='error']");
}
