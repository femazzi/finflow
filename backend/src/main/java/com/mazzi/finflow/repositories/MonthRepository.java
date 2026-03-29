package com.mazzi.finflow.repositories;

import com.mazzi.finflow.entities.Month;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MonthRepository extends JpaRepository<Month, String> {
    List<Month> findAllByOrderByCreatedAtDesc();
}
