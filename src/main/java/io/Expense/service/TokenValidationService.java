package io.Expense.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import io.Expense.model.User;
import io.Expense.model.UserInfoDetails;
import io.Expense.repository.UserRepository;

@Service
public class TokenValidationService {

	@Autowired
    private  JwtService jwtService;
    @Autowired
    private  UserInfoService userInfoService;
    @Autowired
    private  UserRepository userRepository;
    
    // Method to validate the token and get userId
    public ResponseEntity<?> getUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwtToken = token.substring(7);  // Extract JWT token

            try {
                // Extract the username (email) and role from the token
                String username = jwtService.extractUsername(jwtToken);
                String role = jwtService.extractRole(jwtToken);

                // Fetch user details from the database using the username (email)
                Optional<User> user = userRepository.findByEmail(username);
                if (user.isPresent()) {
                    // Convert the user to UserDetails object
                    UserDetails userDetails = new UserInfoDetails(user.get());
                    
                    // Validate the token
                    if (!jwtService.validateToken(jwtToken, userDetails)) {
                        return ResponseEntity.status(401).body("Invalid token.");
                    }

                    // Return the userId as response
                    return ResponseEntity.ok(user.get());
                } else {
                    return ResponseEntity.status(404).body("User not found.");
                }
            } catch (Exception e) {
                return ResponseEntity.status(400).body("Invalid token or error: " + e.getMessage());
            }
        }
        return ResponseEntity.status(400).body("Authorization token is missing or malformed.");
    }

    // Method to get the authenticated user's details
    public User getAuthenticatedUser() {
        // Extract username (email) from SecurityContext
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        // Fetch the user from the repository
        Optional<User> user = userRepository.findByEmail(username);
        if (user.isPresent()) {
            return user.get(); // Return the user object
        }
        
        throw new UsernameNotFoundException("Authenticated user not found");
    }
}
