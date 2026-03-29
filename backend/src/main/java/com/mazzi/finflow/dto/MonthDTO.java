package com.mazzi.finflow.dto;

import java.util.ArrayList;
import java.util.List;

public class MonthDTO {
    private String id;
    private String name;
    private String emoji;
    private String color;
    private String createdAt;
    private Double previousBalance = 0.0;
    private Double previousInvestments = 0.0;

    private List<TransactionDTO> earnings = new ArrayList<>();
    private List<TransactionDTO> expenses = new ArrayList<>();
    private List<TransactionDTO> investments = new ArrayList<>();
    
    private TotalsDTO totals;

    public MonthDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public Double getPreviousBalance() { return previousBalance; }
    public void setPreviousBalance(Double previousBalance) { this.previousBalance = previousBalance; }

    public Double getPreviousInvestments() { return previousInvestments; }
    public void setPreviousInvestments(Double previousInvestments) { this.previousInvestments = previousInvestments; }

    public List<TransactionDTO> getEarnings() { return earnings; }
    public void setEarnings(List<TransactionDTO> earnings) { this.earnings = earnings; }

    public List<TransactionDTO> getExpenses() { return expenses; }
    public void setExpenses(List<TransactionDTO> expenses) { this.expenses = expenses; }

    public List<TransactionDTO> getInvestments() { return investments; }
    public void setInvestments(List<TransactionDTO> investments) { this.investments = investments; }

    public TotalsDTO getTotals() { return totals; }
    public void setTotals(TotalsDTO totals) { this.totals = totals; }
}
