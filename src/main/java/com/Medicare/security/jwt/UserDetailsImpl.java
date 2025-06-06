package com.Medicare.security.jwt;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.Medicare.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Integer userId;
    private String username;
    private String email;
    private String fullName;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Integer userId, String username, String email, String password, String fullName
                             , Collection<? extends GrantedAuthority> authorities
                               ) {
            this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
               .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

 

        return new UserDetailsImpl(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.getFullName()
                ,  authorities
                );
    }

    public Integer getId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }
    
    public String getFullName() {
        return fullName;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
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
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
