package io.Expense.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import io.Expense.model.Category;
import io.Expense.model.User;
import io.Expense.repository.CategoryRepository;
import io.Expense.repository.UserRepository;

@Service
public class CategoryService {
	
	@Autowired
	private CategoryRepository categoryRepository;
    @Autowired
    private UserRepository userRepository;
	
    	public List<Category> getAllPredefinedCategories()
    	{
    		return categoryRepository.findAll();
    	}
    	
    	public Category addUserDefinedCategory(Category category)
    	{
    		User user = userRepository.findById(category.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found!"));
    		
    		category.setUser(user);
    		Category savedCategory = categoryRepository.save(category);
    		return savedCategory;
    	}

		public List<String> getUserCategories(int userId) {
			// TODO Auto-generated method stub
			return (categoryRepository.findAllByUserId(userId));
		}

		public void deleteCategory(int categoryId) {
			// TODO Auto-generated method stub
				
		}
}
