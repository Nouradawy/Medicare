package com.Medicare;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public class employers{
 

    @NotBlank(message = "Employer name can't be blank")
    String Name;
    @NotBlank(message = "Employer Title can't be blank")
    String Title;
    @NotNull(message = "can't be empty")
    int Salary;
    String id;


    public employers(){
        this.Name = Name;
        this.Title = Title;
        this.Salary = Salary;
        this.id = id;
        
    }

    public String getName() {
        return this.Name;
    }

    public void setName(String Name) {
        this.Name = Name;
    }

    public String getTitle() {
        return this.Title;
    }

    public void setTitle(String Title) {
        this.Title = Title;
    }

    public int getSalary() {
        return this.Salary;
    }

    public void setSalary(int Salary) {
        this.Salary = Salary;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }
}