package com.vet.repository;

import com.vet.model.Dueno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DuenoRepository extends JpaRepository<Dueno, Long> {
    boolean existsByDocumento(String documento);
    List<Dueno> findByActivoTrue();
}
