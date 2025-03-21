package com.Medicare.controller.main;

import java.util.ArrayList;
import java.util.List;

import com.Medicare.controller.PatientController;
import com.Medicare.model.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.Medicare.employers;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AppController {

    List<User> AllUsers = new ArrayList<>();
    int Index=-1;

    User myUser = new User();


    @GetMapping("/")
    public String Initial(Model model ) {

        model.addAttribute("User", myUser);

        return "Home/userRegistration";
    }



    @PostMapping("/submit")
    public String AddUser(@ModelAttribute("User") User users )
    {



        return "redirect:/api/public/patient";
    }
//@PostMapping("/submit")
//    public String dataSubmitForm(@Valid @ModelAttribute("Employer") employers Employer,BindingResult result) {
////        System.out.println(result.hasErrors());
//
//        if(result.hasErrors()) {
//
//            return "Home/Employer";
//        }
//        if (Index == -1) {
//        AllEmployers.add(Employer);
//        } else {
//        AllEmployers.set(Index, Employer);
//        }
//        return "redirect:data";
//    }
//
//    @GetMapping("/data")
//    public String showdata(Model model) {
//        model.addAttribute("Alldata", AllEmployers);
//        return "Home/data";
//    }
    
    
    
    
}
