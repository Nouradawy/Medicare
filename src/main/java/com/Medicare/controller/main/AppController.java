package com.Medicare.controller.main;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.Medicare.employers;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AppController {


    List<employers> AllEmployers = new ArrayList<>();
    int Index=-1;

    employers myEmployers = new employers();

    @GetMapping("/")
    public String Initial(Model model ,@RequestParam (required = false) String id) {

        if(id==null){
            id = UUID.randomUUID().toString();
            Index=-1;
        } else {
            for(int i =0; i<AllEmployers.size() ; i++){
                if(AllEmployers.get(i).getId().equals(id)){
                    Index=i;
                    break;
                }
            }
        }



        employers myEmployers = (Index == -1) ? new employers() : AllEmployers.get(Index);
        myEmployers.setId(id);

        model.addAttribute("Employer", myEmployers);

        System.out.println("Initial page  "+ id + "Current index = "+Index);
        return "Home/Employer";
    }



    
@PostMapping("/submit")
    public String dataSubmitForm(@Valid @ModelAttribute("Employer") employers Employer,BindingResult result) {
//        System.out.println(result.hasErrors());

        if(result.hasErrors()) {

            return "Home/Employer";
        }
        if (Index == -1) {
        AllEmployers.add(Employer);
        } else {
        AllEmployers.set(Index, Employer);
        }
        return "redirect:data";
    }

    @GetMapping("/data")
    public String showdata(Model model) {
        model.addAttribute("Alldata", AllEmployers);
        return "Home/data";
    }
    
    
    
    
}
