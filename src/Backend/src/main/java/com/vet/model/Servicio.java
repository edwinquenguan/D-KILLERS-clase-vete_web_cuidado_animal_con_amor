package com.vet.model;

/**
 * Catalogo de servicios de la veterinaria. Cada servicio define el prefijo que se usa
 * para numerar sus turnos y si tiene prioridad (urgencia) en la cola de espera.
 */
public enum Servicio {

    BANO("Baño", "BAN", false),
    CORTE_UNAS("Corte de uñas", "UNA", false),
    CONSULTA_MEDICA("Consulta médica", "CON", false),
    URGENCIA_MEDICA("Urgencia médica", "URG", true),
    PROFILAXIS("Profilaxis", "PRO", false),
    VACUNACION("Vacunación", "VAC", false),
    DESPARASITACION("Desparasitación", "DES", false),
    CIRUGIA("Cirugías", "CIR", false),
    HOSPITALIZACION("Hospitalización", "HOS", false),
    LABORATORIO("Exámenes de laboratorio", "LAB", false),
    IMAGENOLOGIA("Toma de rayos X y ecografías", "IMG", false),
    PREVENTIVOS("Servicios preventivos", "PRE", false);

    private final String label;
    private final String prefijo;
    private final boolean prioritario;

    Servicio(String label, String prefijo, boolean prioritario) {
        this.label = label;
        this.prefijo = prefijo;
        this.prioritario = prioritario;
    }

    public String getLabel() {
        return label;
    }

    public String getPrefijo() {
        return prefijo;
    }

    public boolean isPrioritario() {
        return prioritario;
    }
}
