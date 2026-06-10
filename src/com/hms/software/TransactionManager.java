package com.hms.software;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.logging.Logger;

public class TransactionManager {
    private static final Logger logger = Logger.getLogger(TransactionManager.class.getName());

    // Example of handling a transaction (Requirement: 3 examples)
    public boolean executeTransaction(Runnable transactionLogic) {
        Connection conn = DatabaseConnection.getConnection();
        try {
            conn.setAutoCommit(false); // Start transaction
            transactionLogic.run();    // Execute logic
            conn.commit();             // Commit
            logger.info("Transaction committed successfully.");
            return true;
        } catch (Exception e) {
            try { conn.rollback(); logger.warning("Transaction rolled back."); } 
            catch (SQLException ex) { ex.printStackTrace(); }
            return false;
        } finally {
            try { conn.setAutoCommit(true); } catch (SQLException e) { e.printStackTrace(); }
        }
    }
}