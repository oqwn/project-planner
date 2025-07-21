package com.example.projectplanner.controller;

import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for managing users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserMapper userMapper;

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieve a list of all users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userMapper.findAll();
        System.out.println("Fetching all users. Found: " + users.size() + " users");
        for (User user : users) {
            System.out.println("User: " + user.getName() + " (" + user.getEmail() + ")");
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve a user by their ID")
    public ResponseEntity<User> getUserById(@PathVariable UUID id) {
        Optional<User> user = userMapper.findById(id);
        return user.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create user", description = "Create a new user")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        user.setId(UUID.randomUUID());
        userMapper.insert(user);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user", description = "Update an existing user")
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @RequestBody User user) {
        Optional<User> existingUser = userMapper.findById(id);
        if (existingUser.isPresent()) {
            user.setId(id);
            userMapper.update(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user", description = "Delete a user by ID")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        Optional<User> user = userMapper.findById(id);
        if (user.isPresent()) {
            userMapper.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}