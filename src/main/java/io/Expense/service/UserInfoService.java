package io.Expense.service;

import io.Expense.model.User;
import io.Expense.model.UserInfoDetails;
import io.Expense.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserInfoService implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userDetail = repository.findByEmail(username); // Assuming 'email' is used as username

        // Convert UserInfo to UserDetails
        return userDetail.map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public String addUser(User user) {
        // Check if the user already exists
        if (repository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already taken");
        }

        // Encode password before saving the user
        user.setPassword(encoder.encode(user.getPassword()));
        repository.save(user);
        return "User added successfully: " + user.getEmail(); // Return more descriptive message
    }
}
