package com.hms.software;

import com.hms.domain.Patient;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class PatientDAO {
    private static final Logger logger = Logger.getLogger(PatientDAO.class.getName());

    // Add a new patient to the database
    public boolean addPatient(Patient patient) {
        String sql = "INSERT INTO patients (first_name, last_name, dob, gender, blood_type, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, patient.getFirstName());
            pstmt.setString(2, patient.getLastName());
            pstmt.setDate(3, patient.getDob());
            pstmt.setString(4, patient.getGender());
            pstmt.setString(5, patient.getBloodType());
            pstmt.setString(6, patient.getPhone());
            pstmt.setString(7, patient.getAddress());
            
            int rows = pstmt.executeUpdate();
            logger.info("Patient added successfully! Rows affected: " + rows);
            return rows > 0;
        } catch (SQLException e) {
            logger.severe("Error adding patient: " + e.getMessage());
            return false;
        }
    }

    // Get all patients
    public List<Patient> getAllPatients() {
        List<Patient> patients = new ArrayList<>();
        String sql = "SELECT * FROM patients";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Patient p = new Patient();
                p.setPatId(rs.getInt("pat_id"));
                p.setFirstName(rs.getString("first_name"));
                p.setLastName(rs.getString("last_name"));
                p.setPhone(rs.getString("phone"));
                patients.add(p);
            }
        } catch (SQLException e) {
            logger.severe("Error fetching patients: " + e.getMessage());
        }
        return patients;
    }
}