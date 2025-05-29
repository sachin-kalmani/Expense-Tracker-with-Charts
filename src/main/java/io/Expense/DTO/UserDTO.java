package io.Expense.DTO;

import io.Expense.model.User;
import jakarta.persistence.Column;

public class UserDTO {
    private String firstName;

    private String lastName;
    
    private String email;

    private String phone;
    
    public UserDTO(User user) {
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
    }
}
