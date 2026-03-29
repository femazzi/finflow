package com.mazzi.finflow.dto;

public class TotalsDTO {
    private Double earnings = 0.0;
    private Double expenses = 0.0;
    private Double investments = 0.0;
    private Double balance = 0.0;

    public TotalsDTO() {}

    public Double getEarnings() { return earnings; }
    public void setEarnings(Double earnings) { this.earnings = earnings; }

    public Double getExpenses() { return expenses; }
    public void setExpenses(Double expenses) { this.expenses = expenses; }

    public Double getInvestments() { return investments; }
    public void setInvestments(Double investments) { this.investments = investments; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }
}
