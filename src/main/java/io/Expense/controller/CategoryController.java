package io.Expense.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.Expense.model.Category;
import io.Expense.model.Expense;
import io.Expense.model.User;
import io.Expense.repository.CategoryRepository;
import io.Expense.repository.UserRepository;
import io.Expense.service.CategoryService;
import io.Expense.service.TokenValidationService;

@RestController
@CrossOrigin("*")
@RequestMapping("/user/auth/category")
public class CategoryController {

    @Autowired
	private CategoryRepository categoryRepository;
    
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenValidationService tokenService;
    

//    //Fetch all predefined categories
//    @GetMapping("/get")
//    public ResponseEntity<List<Category>> getAllCategories() {
//        try {
//            return ResponseEntity.ok(categoryService.getAllPredefinedCategories());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }

    @GetMapping("/get")
	 public ResponseEntity<?> getAllCategories(@RequestHeader("Authorization") String token){
		 // Get the user from the token
		    ResponseEntity<?> response = tokenService.getUserIdFromToken(token);

		    if (response.getStatusCode().is2xxSuccessful()) {
		        User user = (User) response.getBody();

		        // Fetch all expenses for the user
		        return ResponseEntity.ok(categoryRepository.findAll());
		    }

		    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
	 }
    
    
    //Add a new category for a user
    @PostMapping("/add")
    public ResponseEntity<?> saveCategory(@RequestBody Category category) {
        try {   
        	return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.addUserDefinedCategory(category));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error saving category: " + e.getMessage());
        }
    }
    
    //fetch all predefined and userdefined categories of a user
    @GetMapping("/get/{userId}")
    public ResponseEntity<?> getUserCategories(@PathVariable int userId)
    {
    	try {
    		return ResponseEntity.status(HttpStatus.OK).body(categoryService.getUserCategories(userId));
    	}catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving category: " + e.getMessage());
    		}
    }
    
    //Deleting a particular Category
    @DeleteMapping("/delete/{categoryId}")
    public ResponseEntity<?> deleteCategory(@PathVariable int categoryId)
    {
    	try {
            categoryService.deleteCategory(categoryId);
            return ResponseEntity.ok("Category deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
    
}
