package com.Medicare.payload.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


//        AuthTokenFilter not properly setting the Authentication object in the SecurityContextHolder.
//        This happens because the request is rejected before reaching the ReservationServiceImp.CreateReservation method
//        due to a HttpMessageNotReadableException thrown by Spring when it fails to deserialize the invalid ReservationStatus.

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        // Customize the error message for invalid enum values
        String errorMessage = "Invalid ReservationStatus value provided. Accepted values are: [Postponed, Confirmed, Canceled, Completed, Pending]";
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }
}