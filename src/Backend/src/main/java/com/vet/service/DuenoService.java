package com.vet.service;

import com.vet.config.ResourceNotFoundException;
import com.vet.model.Dueno;
import com.vet.repository.DuenoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DuenoService {

    private final DuenoRepository repository;

    public DuenoService(DuenoRepository repository) {
        this.repository = repository;
    }

    public List<Dueno> findAll() {
        return repository.findAll();
    }

    public Dueno findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dueno no encontrado: " + id));
    }

    public Dueno create(Dueno dueno) {
        dueno.setId(null);
        return repository.save(dueno);
    }

    public Dueno update(Long id, Dueno datos) {
        Dueno dueno = findById(id);
        dueno.setNombre(datos.getNombre());
        dueno.setContacto(datos.getContacto());
        dueno.setDireccion(datos.getDireccion());
        dueno.setTipoDocumento(datos.getTipoDocumento());
        dueno.setDocumento(datos.getDocumento());
        return repository.save(dueno);
    }

    public void delete(Long id) {
        Dueno dueno = findById(id);
        repository.delete(dueno);
    }
}
