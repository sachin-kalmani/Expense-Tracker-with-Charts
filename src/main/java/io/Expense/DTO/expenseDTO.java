package io.Expense.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import io.Expense.model.Expense;

public class expenseDTO {
    private Integer expenseId;
    private BigDecimal amount;
    private String expenseDescription;
    private LocalDateTime expenseRecordTime;
    private String categoryName;
    private Integer userId;

    public expenseDTO(Expense expense) {
        this.expenseId = expense.getExpenseId();
        this.amount = expense.getAmount();
        this.expenseDescription = expense.getExpenseDescription();
        this.expenseRecordTime = expense.getExpenseRecordTime();
        this.categoryName = expense.getCategory().getName();
        this.userId = expense.getUser().getUserId();
    }

	public Integer getExpenseId() {
		return expenseId;
	}

	public void setExpenseId(Integer expenseId) {
		this.expenseId = expenseId;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getExpenseDescription() {
		return expenseDescription;
	}

	public void setExpenseDescription(String expenseDescription) {
		this.expenseDescription = expenseDescription;
	}

	public LocalDateTime getExpenseRecordTime() {
		return expenseRecordTime;
	}

	public void setExpenseRecordTime(LocalDateTime expenseRecordTime) {
		this.expenseRecordTime = expenseRecordTime;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}
    // Getters and setters
}