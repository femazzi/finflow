package com.mazzi.finflow.controllers;

import com.mazzi.finflow.dto.MonthDTO;
import com.mazzi.finflow.dto.TransactionDTO;
import com.mazzi.finflow.services.MonthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Ponto de Entrada Principal (Entrypoint) para a API Backend do Finflow.
 * 
 * DECISÃO DE DESIGN:
 * - Implementa uma arquitetura RESTful retornando DTOs padronizados para desacoplar as entidades internas do frontend.
 * - A configuração global de CORS no nível do controlador permite explicitamente os verbos OPTIONS e DELETE, 
 *   prevenindo erros HTTP 403 e bloqueios de Preflight durante as mutações do React Query.
 */
@RestController
@RequestMapping("/api/months")
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}, maxAge = 3600)
public class MonthController {

    private final MonthService monthService;

    public MonthController(MonthService monthService) {
        this.monthService = monthService;
    }

    /**
     * Recupera todos os meses e calcula antecipadamente (eager) os saldos das transações aninhadas.
     * Utilizado exclusivamente para hidratar o estado inicial do React.
     */
    @GetMapping
    public ResponseEntity<List<MonthDTO>> getAllMonths() {
        return ResponseEntity.ok(monthService.getAllMonths());
    }

    @PostMapping
    public ResponseEntity<MonthDTO> createMonth(@RequestBody MonthDTO dto) {
        return ResponseEntity.ok(monthService.createMonth(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MonthDTO> updateMonth(@PathVariable String id, @RequestBody MonthDTO dto) {
        return ResponseEntity.ok(monthService.updateMonth(id, dto));
    }

    /**
     * Deleta um determinado mês. Retorna HTTP 204 (No Content) de acordo com os padrões REST 
     * após a exclusão bem-sucedida na camada de persistência.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMonth(@PathVariable String id) {
        monthService.deleteMonth(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{monthId}/transactions")
    public ResponseEntity<MonthDTO> addTransaction(@PathVariable String monthId, @RequestBody TransactionDTO dto) {
        return ResponseEntity.ok(monthService.addTransaction(monthId, dto));
    }

    @PutMapping("/{monthId}/transactions/{transactionId}")
    public ResponseEntity<MonthDTO> updateTransaction(@PathVariable String monthId, @PathVariable String transactionId, @RequestBody TransactionDTO dto) {
        return ResponseEntity.ok(monthService.updateTransaction(monthId, transactionId, dto));
    }

    @DeleteMapping("/{monthId}/transactions/{transactionId}")
    public ResponseEntity<MonthDTO> deleteTransaction(@PathVariable String monthId, @PathVariable String transactionId) {
        return ResponseEntity.ok(monthService.deleteTransaction(monthId, transactionId));
    }
}
