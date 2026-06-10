package com.hms.software;

import com.hms.domain.Appointment;
import java.sql.*;
import java.util.logging.Logger;

public class AppointmentDAO {
    private static final Logger logger = Logger.getLogger(AppointmentDAO.class.getName());

    public boolean bookAppointment(Appointment app) {
        // Using the Stored Procedure we created earlier!
        String sql = "{call sp_book_appointment(?, ?, ?, ?)}";
        try (Connection conn = DatabaseConnection.getConnection();
             CallableStatement cstmt = conn.prepareCall(sql)) {
            
            cstmt.setInt(1, app.getPatId());
            cstmt.setInt(2, app.getDocId());
            cstmt.setDate(3, app.getAppDate());
            cstmt.setTime(4, app.getAppTime());
            
            cstmt.execute();
            logger.info("Appointment booked via Stored Procedure!");
            return true;
        } catch (SQLException e) {
            logger.severe("Error booking appointment: " + e.getMessage());
            return false;
        }
    }
}