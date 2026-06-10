package com.hms.software;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DatabaseConnection {
    private static Connection connection = null;
    
    // Database URL (Make sure your database name is hms_db)
    private static final String URL = "jdbc:mysql://localhost:3306/hms_db";
    private static final String USERNAME = "root";
    
    // ⚠️ IMPORTANT: Put your actual MySQL password inside the quotes below!
    // If you don't have a password, leave it as "".
    private static final String PASSWORD = "admin"; 
    
    private static final Logger logger = Logger.getLogger(DatabaseConnection.class.getName());

    // Private constructor to prevent creating objects of this class
    private DatabaseConnection() {}

    // Method to get the database connection
        public static Connection getConnection() {
        try {
            // Check if connection is null OR if it was accidentally closed
            if (connection == null || connection.isClosed()) {
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
                logger.info("Database connection established successfully!");
            }
        } catch (ClassNotFoundException e) {
            logger.log(Level.SEVERE, "MySQL JDBC Driver not found.", e);
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Failed to connect. Check your password.", e);
        }
        return connection;
    }

    // Method to close the connection
    public static void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
                connection = null;
                logger.info("Database connection closed");
            } catch (SQLException e) {
                logger.log(Level.SEVERE, "Error closing database connection", e);
            }
        }
    }
}