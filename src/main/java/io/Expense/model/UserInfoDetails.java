package io.Expense.model;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;



public class UserInfoDetails implements UserDetails {

    private final String username; // email is used as the username
    private final String password;
    private final List<GrantedAuthority> authorities; // List of authorities/roles

    public UserInfoDetails(User user) {
        this.username = user.getEmail();
        this.password = user.getPassword();
        this.authorities = List.of(new SimpleGrantedAuthority(user.getUserRole()));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // You can return roles here if needed in the future
    	// Convert roles to GrantedAuthority objects
    	return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Account is never expired
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Account is never locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credentials never expire
    }

    @Override
    public boolean isEnabled() {
        return true; // Account is always enabled
    }
}
