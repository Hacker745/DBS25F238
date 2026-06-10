package com.hms;

import com.hms.domain.Patient;
import com.hms.software.PatientDAO;
import java.sql.Date;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Testing Hospital Management Backend ===");
        
        // 1. Test Adding a Patient
        PatientDAO dao = new PatientDAO();
        Patient newPatient = new Patient(
            "John", "Doe", 
            Date.valueOf("1990-05-15"), 
            "M", "O+", "1234567890", "123 Main St, Lahore"
        );
        
        System.out.println("Adding patient...");
        boolean added = dao.addPatient(newPatient);
        
        if (added) {
            System.out.println("✅ SUCCESS: Patient added to database!");
        } else {
            System.out.println("❌ FAILED to add patient.");
        }

        // 2. Test Fetching Patients
        System.out.println("\nFetching all patients...");
        List<Patient> patients = dao.getAllPatients();
        for (Patient p : patients) {
            System.out.println("-> ID: " + p.getPatId() + ", Name: " + p.getFirstName() + " " + p.getLastName());
        }

        System.out.println("\n=== Backend Test Complete ===");
    }
}