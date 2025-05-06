package io.Expense.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.Expense.model.Category;
import io.Expense.model.Expense;
import io.Expense.model.User;
import io.Expense.repository.CategoryRepository;
import io.Expense.repository.ExpenseRepository;
import io.Expense.repository.UserRepository;
import io.Expense.service.CategoryService;
import io.Expense.service.TokenValidationService;

@RestController
@CrossOrigin("*")
@RequestMapping("/user/auth/expense")
public class expenseController {
			
	 @Autowired
	    private ExpenseRepository expenseRepository;
	 @Autowired
	 	private UserRepository userRepository;
	 @Autowired
	 	private CategoryRepository categoryRepository;
	 @Autowired
	 	private TokenValidationService tokenService;
	 
	 
	 @PostMapping("/add")
	 public ResponseEntity<?> saveExpense(@RequestBody Expense expense,@RequestHeader("Authorization") String token){
			  ResponseEntity<?> response = tokenService.getUserIdFromToken(token);
		    	
		    	if(response.getStatusCode().is2xxSuccessful())
		    	{
		    		User user = (User) response.getBody();
		    		expense.setUser(user);
		    		Category category = categoryRepository.findById(expense.getCategoryId())
								.orElseThrow(() -> new RuntimeException("Category not found!"));
		    		expense.setCategory(category);
		    		Expense savedExpense = expenseRepository.save(expense);

		    		return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
		    	}
	        	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error saving expense: " + response);
	 }
	 
	 @GetMapping("/show")
	 public ResponseEntity<?> showExpense(@RequestHeader("Authorization") String token){
		 // Get the user from the token
		    ResponseEntity<?> response = tokenService.getUserIdFromToken(token);

		    if (response.getStatusCode().is2xxSuccessful()) {
		        User user = (User) response.getBody();

		        // Fetch all expenses for the user
		        List<Expense> userExpenses = expenseRepository.findByUser(user);
		        return ResponseEntity.ok(userExpenses);
		    }

		    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
	 }
	 
	 @PutMapping("/{id}/edit")
	 public ResponseEntity<?> editExpense(@PathVariable Integer id,
	                                      @RequestBody Expense expense,
	                                      @RequestHeader("Authorization") String token) {
	     
	     ResponseEntity<?> response = tokenService.getUserIdFromToken(token);
	     
	     if (!response.getStatusCode().is2xxSuccessful()) {
	         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token or user.");
	     }

	     User user = (User) response.getBody();

	     return expenseRepository.findById(id).map(existingExpense -> {
	         if (!existingExpense.getUser().getUserId().equals(user.getUserId())) {
	             return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You cannot edit this expense.");
	         }

	         Category category = categoryRepository.findById(expense.getCategoryId())
	                             .orElseThrow(() -> new RuntimeException("Category not found!"));

	         existingExpense.setAmount(expense.getAmount());
	         existingExpense.setExpenseDescription(expense.getExpenseDescription());
	         existingExpense.setCategory(category);

	         Expense savedExpense = expenseRepository.save(existingExpense);
	         return ResponseEntity.ok(savedExpense);

	     }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found."));
	 }
	 
	 
	 @DeleteMapping("/{id}/delete")
	 public ResponseEntity<?> deleteExpense(@PathVariable Integer id, 
	                                        @RequestHeader("Authorization") String token) {

	     ResponseEntity<?> response = tokenService.getUserIdFromToken(token);
	     
	     if (!response.getStatusCode().is2xxSuccessful()) {
	         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token or user.");
	     }

	     User user = (User) response.getBody();

	     return expenseRepository.findById(id).map(expense -> {
	         if (!expense.getUser().getUserId().equals(user.getUserId())) {
	             return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You cannot delete this expense.");
	         }

	         expenseRepository.delete(expense);
	         return ResponseEntity.ok("Expense deleted successfully.");
	         
	     }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found."));
	 }


}
