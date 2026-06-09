package com.vet.e2e.questions;

import com.vet.e2e.ui.DuenoForm;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;

/**
 * Pregunta Screenplay: el texto de la tabla de duenos.
 */
public class DuenosListados implements Question<String> {

    public static Question<String> textoDeLaTabla() {
        return new DuenosListados();
    }

    @Override
    public String answeredBy(Actor actor) {
        return Text.of(DuenoForm.LISTA).answeredBy(actor);
    }
}
