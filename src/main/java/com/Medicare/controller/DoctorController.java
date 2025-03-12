//package com.Medicare.controller;
//import com.Medicare.service.DoctorService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.GetMapping;
//
//@Controller
//public class DoctorController {
//
//    @Autowired
//    private DoctorService doctorService;
//
//    @GetMapping("/doctor/dashboard")
//    public String doctorDashboard() {
//        return "doctor/dashboard"; // Template for doctor dashboard
//    }
//
//    @GetMapping("/doctor/reservations")
//    public String doctorReservations() {
//        return "doctor/reservations"; // Template for doctor reservations
//    }
//
//    @GetMapping("/doctor/calendar")
//    public String doctorCalendar() {
//        return "doctor/calendar"; // Template for doctor calendar
//    }
//}