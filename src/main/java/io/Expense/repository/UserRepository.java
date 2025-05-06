package io.Expense.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import io.Expense.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

	Optional<User> findByEmail(String email);

}
