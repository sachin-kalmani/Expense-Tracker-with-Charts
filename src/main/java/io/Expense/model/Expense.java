package io.Expense.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "EXPENSE")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EXPENSE_ID")
    private Integer expenseId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "AMOUNT", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private Category category;

    @Column(name = "EXPENSE_DESCRIPTION", columnDefinition = "TEXT")
    private String expenseDescription;

    @CreationTimestamp
    @Column(name = "EXPENSE_RECORDTIME", updatable = false)
    private LocalDateTime expenseRecordTime;
    
    @Transient
    private int categoryId;

    @Transient
    private int userId;
    
    public Expense() {}

    public Expense(User user, BigDecimal amount, Category category, String expenseDescription) {
        this.user = user;
        this.amount = amount;
        this.category = category;
        this.expenseDescription = expenseDescription;
    }

    // Getters and Setters
    public Integer getExpenseId() { return expenseId; }
    public void setExpenseId(Integer expenseId) { this.expenseId = expenseId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getExpenseDescription() { return expenseDescription; }
    public void setExpenseDescription(String expenseDescription) { this.expenseDescription = expenseDescription; }

    public LocalDateTime getExpenseRecordTime() { return expenseRecordTime; }

    public Integer getCategoryId() {
        return category != null ? category.getId() : null;
    }

    public Integer getUserId() {
        return user != null ? user.getUserId() : null;
    }
}
