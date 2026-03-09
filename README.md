# 🏥 Medicare: Medical Services Platform

> A comprehensive full-stack web application designed to streamline the healthcare experience by providing secure appointment scheduling, role-based access control, and intuitive dashboards for both patients and medical professionals.

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)]()
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)]()
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)]()

---

## 📖 Overview

Medicare was developed to solve the complexities of modern medical scheduling and data management. By decoupling the client-side interface from the server-side logic, the platform ensures a highly responsive user experience across devices while maintaining strict security and data integrity standards on the backend.

### 🎯 Key Features

* **Role-Based Access Control (RBAC):** Secure, distinct routing and dashboards for Patients, Doctors, and Administrators.
* **Smart Appointment Scheduling:** Real-time availability checking and automated booking workflows.
* **Secure Authentication:** Encrypted user login sessions and protected API endpoints.
* **Interactive UI:** A highly responsive, modern interface built with React components and optimized state management.
* **Efficient Data Storage:** A normalized MySQL relational database designed for rapid querying and scaling.

---

## 🏗️ System Architecture & Tech Stack

The application follows a standard client-server architecture, communicating via secure RESTful APIs.

### Frontend
* **Framework:** React.js
* **Routing:** React Router (Handling protected routes and role-based redirects)
* **Styling:** Custom CSS / Component Libraries for responsive design

### Backend
* **Framework:** Spring Boot (Java)
* **API Design:** RESTful architecture standards
* **Security:** Spring Security & JWT Authentication 
* **Data Access:** Spring Data JPA / Hibernate

### Database
* **Database Management:** MySQL
* **Design:** Highly optimized relational schema utilizing indexing for rapid appointment retrieval and user verification.

---

## 📸 Application Gallery

*(Note: Replace these placeholder paths with the actual paths to your images in your repository)*

### Patient Dashboard
<img src="./public/assets/projects/Medicare/Picture1.png" alt="Medicare Dashboard" width="800"/>

### Appointment Booking Flow
<img src="https://picsum.photos/id/1015/1000/600/" alt="Booking Screen" width="800"/>

---

## 🚀 Getting Started (Local Development)

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites
* Node.js & npm
* Java Development Kit (JDK 17+)
* MySQL Server
* Maven

### 1. Database Setup
1. Open your MySQL client.
2. Create a new database named `medicare_db`.
3. Update the `application.properties` file in the Spring Boot project with your local MySQL credentials.

### 2. Backend Setup (Spring Boot)
```bash
# Navigate to the backend directory
cd medicare-backend

# Clean and build the project
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
