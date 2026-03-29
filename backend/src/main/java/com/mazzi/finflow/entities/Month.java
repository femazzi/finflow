package com.mazzi.finflow.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "months")
public class Month {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    private String emoji;
    private String color;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "month", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();

    public Month() {}

    public Month(String id, String name, String emoji, String color, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.emoji = emoji;
        this.color = color;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }

    public void addTransaction(Transaction transaction) {
        transactions.add(transaction);
        transaction.setMonth(this);
    }
}
