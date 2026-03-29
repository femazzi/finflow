package com.mazzi.finflow.services;

import com.mazzi.finflow.dto.MonthDTO;
import com.mazzi.finflow.dto.TotalsDTO;
import com.mazzi.finflow.dto.TransactionDTO;
import com.mazzi.finflow.entities.Month;
import com.mazzi.finflow.entities.Transaction;
import com.mazzi.finflow.entities.TransactionType;
import com.mazzi.finflow.repositories.MonthRepository;
import com.mazzi.finflow.repositories.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

/**
 * Classe de Serviço (Service) responsável pelo gerenciamento dos Meses Financeiros e suas Transações em cascata.
 * 
 * DECISÃO DE DESIGN:
 * - Marcada como @Transactional no nível da classe para garantir que todas as mutações no banco de dados
 *   (especialmente as exclusões) sejam atômicas e interajam corretamente com o cache L1 e persistência do Hibernate.
 * - Isso previne DataIntegrityViolationExceptions ao manipular coleções de pai-filho.
 */
@Service
@Transactional
public class MonthService {

    private final MonthRepository monthRepository;
    private final TransactionRepository transactionRepository;

    public MonthService(MonthRepository monthRepository, TransactionRepository transactionRepository) {
        this.monthRepository = monthRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<MonthDTO> getAllMonths() {
        List<Month> months = monthRepository.findAllByOrderByCreatedAtDesc();
        
        // Precisamos calcular o saldo em cascata do mais antigo para o mais novo caso queiramos seguir a lógica do React estritamente.
        // Por questões de simplicidade e para bater com a interface atual (UI) exatamente:
        return months.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public MonthDTO createMonth(MonthDTO dto) {
        Month month = new Month(
                UUID.randomUUID().toString(),
                dto.getName(),
                dto.getEmoji(),
                dto.getColor(),
                LocalDateTime.now()
        );
        month = monthRepository.save(month);
        return convertToDTO(month);
    }

    public MonthDTO updateMonth(String id, MonthDTO dto) {
        Month month = monthRepository.findById(id).orElseThrow(() -> new RuntimeException("Month not found"));
        if (dto.getName() != null) month.setName(dto.getName());
        if (dto.getEmoji() != null) month.setEmoji(dto.getEmoji());
        if (dto.getColor() != null) month.setColor(dto.getColor());
        
        month = monthRepository.save(month);
        return convertToDTO(month);
    }

    /**
     * Remove completamente um Mês e todas as suas Transações associadas.
     * 
     * Para evitar violações de restrição de chave estrangeira antes de deletar o Mês,
     * o repositório de transações expurga explicitamente os filhos primeiro (Deleção em Cascata Manual).
     */
    public void deleteMonth(String id) {
        Month month = monthRepository.findById(id).orElseThrow(() -> new RuntimeException("Month not found"));
        transactionRepository.deleteAll(month.getTransactions());
        monthRepository.deleteById(id);
    }

    public MonthDTO addTransaction(String monthId, TransactionDTO dto) {
        Month month = monthRepository.findById(monthId).orElseThrow(() -> new RuntimeException("Month not found"));
        
        Transaction tx = new Transaction(
                UUID.randomUUID().toString(),
                dto.getDescription(),
                dto.getAmount(),
                dto.getCategory(),
                TransactionType.valueOf(dto.getType().toUpperCase())
        );
        month.addTransaction(tx);
        monthRepository.save(month);
        
        return convertToDTO(month);
    }

    /**
     * Deleta uma transação específica com segurança, mantendo o Mês pai intacto.
     * 
     * DECISÃO DE DESIGN:
     * - Em vez de apenas deletar via transactionRepository, nós a desvinculamos manualmente
     *   da lista interna (cache) do Mês.
     * - Isso garante que o MonthDTO retornado reflita o estado instantâneo pós-deleção
     *   sem ter que limpar o cache e buscar o Mês novamente no banco de dados.
     */
    public MonthDTO deleteTransaction(String monthId, String transactionId) {
        Month month = monthRepository.findById(monthId).orElseThrow(() -> new RuntimeException("Month not found"));
        Transaction txToRemove = null;
        for (Transaction tx : month.getTransactions()) {
            if (tx.getId().equals(transactionId)) {
                txToRemove = tx;
                break;
            }
        }
        if (txToRemove != null) {
            month.getTransactions().remove(txToRemove);
            transactionRepository.delete(txToRemove);
            monthRepository.save(month);
        }
        return convertToDTO(month);
    }
    
    public MonthDTO updateTransaction(String monthId, String transactionId, TransactionDTO dto) {
        Transaction tx = transactionRepository.findById(transactionId).orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (dto.getDescription() != null) tx.setDescription(dto.getDescription());
        if (dto.getAmount() != null) tx.setAmount(dto.getAmount());
        if (dto.getCategory() != null) tx.setCategory(dto.getCategory());
        if (dto.getType() != null) tx.setType(TransactionType.valueOf(dto.getType().toUpperCase()));
        
        transactionRepository.save(tx);
        Month month = monthRepository.findById(monthId).orElseThrow(() -> new RuntimeException("Month not found"));
        return convertToDTO(month);
    }

    private MonthDTO convertToDTO(Month month) {
        MonthDTO dto = new MonthDTO();
        dto.setId(month.getId());
        dto.setName(month.getName());
        dto.setEmoji(month.getEmoji());
        dto.setColor(month.getColor());
        dto.setCreatedAt(month.getCreatedAt().toString());

        TotalsDTO totals = new TotalsDTO();

        if (month.getTransactions() != null) {
            for (Transaction tx : month.getTransactions()) {
                TransactionDTO txDTO = new TransactionDTO();
                txDTO.setId(tx.getId());
                txDTO.setDescription(tx.getDescription());
                txDTO.setAmount(tx.getAmount());
                txDTO.setCategory(tx.getCategory());
                txDTO.setType(tx.getType().name());

                if (tx.getType() == TransactionType.EARNING) {
                    dto.getEarnings().add(txDTO);
                    totals.setEarnings(totals.getEarnings() + tx.getAmount());
                } else if (tx.getType() == TransactionType.EXPENSE) {
                    dto.getExpenses().add(txDTO);
                    totals.setExpenses(totals.getExpenses() + tx.getAmount());
                } else if (tx.getType() == TransactionType.INVESTMENT) {
                    dto.getInvestments().add(txDTO);
                    totals.setInvestments(totals.getInvestments() + tx.getAmount());
                }
            }
        }
        
        totals.setBalance(totals.getEarnings() - totals.getExpenses() - totals.getInvestments());
        dto.setTotals(totals);

        return dto;
    }
}
