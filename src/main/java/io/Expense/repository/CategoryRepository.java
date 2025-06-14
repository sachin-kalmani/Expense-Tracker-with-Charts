package io.Expense.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import io.Expense.model.Category;
import io.Expense.model.Expense;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
	
	@Query(nativeQuery = true,value = "SELECT category_name FROM category WHERE category_defined = 'Predefined' OR (category_defined = 'UserDefined' AND user_id =:userId);")
	List<String> findAllByUserId(int userId);

	Optional<Category> findByName(String categoryName);
	
}
