package io.Expense.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import io.Expense.model.Expense;
import io.Expense.model.User;

public interface ExpenseRepository extends JpaRepository<Expense, Integer>{

	List<Expense> findByUser(User user);

}
