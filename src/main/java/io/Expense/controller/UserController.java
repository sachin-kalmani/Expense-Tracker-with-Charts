package io.Expense.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.Expense.DTO.UserDTO;
import io.Expense.model.AuthRequest;
import io.Expense.model.User;
import io.Expense.model.UserInfoDetails;
import io.Expense.repository.UserRepository;
import io.Expense.service.JwtService;
import io.Expense.service.TokenValidationService;

@RestController
@CrossOrigin("*")
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private TokenValidationService tokenService;
    
    // User registration
    @PostMapping("/sign-in")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setUserRole("ROLE_USER");
        User savedUser = userRepo.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
    
    
 // JWT token generation
    @PostMapping("/login")
    public ResponseEntity<String> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );

            if (authentication.isAuthenticated()) {
            	User user = userRepo.findByEmail(authRequest.getUsername()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
                String role = user.getUserRole();
                String token = jwtService.generateToken(authRequest.getUsername(),role);
                // Return user details along with the token
                UserInfoDetails userDetails = new UserInfoDetails(user);
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("userDetails", userDetails);
//                return new ResponseEntity<>(token, HttpStatus.OK);
                return ResponseEntity.status(HttpStatus.OK).body(token);
            } else {
                throw new UsernameNotFoundException("User not authenticated.");
            }
        } catch (Exception e) {
//            return new ResponseEntity<>("Authentication failed: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/auth/getUserDetails")
    public ResponseEntity<?> getUserDetails(@RequestHeader("Authorization") String token) {
    	ResponseEntity<?> response = tokenService.getUserIdFromToken(token);
    	
    	if(response.getStatusCode().is2xxSuccessful())
    	{
    		User user = (User) response.getBody();
    		return ResponseEntity.ok(user);
    	}
    	return response;
    }
}
