package com.mazzi.finflow.dto;

public class TransactionDTO {
    private String id;
    private String description;
    private Double amount;
    private String category;
    private String type; // EARNING, EXPENSE, INVESTMENT

    public TransactionDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
