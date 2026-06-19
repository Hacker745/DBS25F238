package com.hms;

import com.hms.domain.*;
import com.hms.software.*;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.sql.*;
import java.util.*;

public class Server {

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        // API Endpoints
        server.createContext("/api/patients", new PatientHandler());
        server.createContext("/api/doctors", new DoctorHandler());
        server.createContext("/api/appointments", new AppointmentHandler());
        server.createContext("/api/medicines", new MedicineHandler());
        server.createContext("/api/wards", new WardHandler());
        server.createContext("/api/reports", new ReportHandler());
        
        server.setExecutor(null); 
        server.start();
        System.out.println("✅ Backend Server started on http://localhost:8080");
        System.out.println("✅ API Endpoints Ready:");
        System.out.println("   - /api/patients");
        System.out.println("   - /api/doctors");
        System.out.println("   - /api/appointments");
        System.out.println("   - /api/medicines");
        System.out.println("   - /api/wards");
    }

    // Enable CORS for all handlers
    private static void setCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
    }

    // ============ PATIENT HANDLER ============
    static class PatientHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            PatientDAO dao = new PatientDAO();
            
            if ("GET".equals(exchange.getRequestMethod())) {
                List<Patient> patients = dao.getAllPatients();
                String response = patientsToJson(patients);
                byte[] bytes = response.getBytes();
                exchange.sendResponseHeaders(200, bytes.length);
                exchange.getResponseBody().write(bytes);
            } else if ("POST".equals(exchange.getRequestMethod())) {
                try {
                    Map<String, String> params = parseRequestBody(exchange);
                    Patient p = new Patient();
                    p.setFirstName(params.get("firstName"));
                    p.setLastName(params.get("lastName"));
                    p.setDob(java.sql.Date.valueOf(params.get("dob")));
                    p.setGender(params.get("gender"));
                    p.setBloodType(params.get("bloodType"));
                    p.setPhone(params.get("phone"));
                    p.setAddress(params.get("address"));
                    
                    boolean success = dao.addPatient(p);
                    String response = success ? "{\"status\":\"success\"}" : "{\"status\":\"error\"}";
                    exchange.sendResponseHeaders(200, response.length());
                    exchange.getResponseBody().write(response.getBytes());
                } catch (Exception e) {
                    e.printStackTrace();
                    exchange.sendResponseHeaders(500, 0);
                }
            }
            exchange.getResponseBody().close();
        }
        
        private String patientsToJson(List<Patient> patients) {
            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < patients.size(); i++) {
                Patient p = patients.get(i);
                json.append("{")
                    .append("\"id\":").append(p.getPatId()).append(",")
                    .append("\"firstName\":\"").append(p.getFirstName()).append("\",")
                    .append("\"lastName\":\"").append(p.getLastName()).append("\",")
                    .append("\"dob\":\"").append(p.getDob()).append("\",")
                    .append("\"gender\":\"").append(p.getGender()).append("\",")
                    .append("\"bloodType\":\"").append(p.getBloodType()).append("\",")
                    .append("\"phone\":\"").append(p.getPhone()).append("\",")
                    .append("\"address\":\"").append(p.getAddress()).append("\"")
                    .append("}");
                if (i < patients.size() - 1) json.append(",");
            }
            json.append("]");
            return json.toString();
        }
    }

    // ============ DOCTOR HANDLER ============
    static class DoctorHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            if ("GET".equals(exchange.getRequestMethod())) {
                try {
                    Connection conn = DatabaseConnection.getConnection();
                    Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery("SELECT * FROM doctors");
                    
                    StringBuilder json = new StringBuilder("[");
                    int count = 0;
                    while (rs.next()) {
                        if (count > 0) json.append(",");
                        json.append("{")
                            .append("\"id\":").append(rs.getInt("doc_id")).append(",")
                            .append("\"firstName\":\"").append(rs.getString("first_name")).append("\",")
                            .append("\"lastName\":\"").append(rs.getString("last_name")).append("\",")
                            .append("\"specialization\":\"").append(rs.getString("specialization")).append("\",")
                            .append("\"phone\":\"").append(rs.getString("phone")).append("\"")
                            .append("}");
                        count++;
                    }
                    json.append("]");
                    
                    byte[] bytes = json.toString().getBytes();
                    exchange.sendResponseHeaders(200, bytes.length);
                    exchange.getResponseBody().write(bytes);
                } catch (Exception e) {
                    e.printStackTrace();
                    exchange.sendResponseHeaders(500, 0);
                }
            } else if ("POST".equals(exchange.getRequestMethod())) {
                try {
                    Map<String, String> params = parseRequestBody(exchange);
                    Connection conn = DatabaseConnection.getConnection();
                    PreparedStatement pstmt = conn.prepareStatement(
                        "INSERT INTO doctors (first_name, last_name, specialization, dept_id, phone) VALUES (?, ?, ?, ?, ?)"
                    );
                    pstmt.setString(1, params.get("firstName"));
                    pstmt.setString(2, params.get("lastName"));
                    pstmt.setString(3, params.get("specialization"));
                    pstmt.setInt(4, Integer.parseInt(params.get("deptId")));
                    pstmt.setString(5, params.get("phone"));
                    
                    int rows = pstmt.executeUpdate();
                    String response = rows > 0 ? "{\"status\":\"success\"}" : "{\"status\":\"error\"}";
                    exchange.sendResponseHeaders(200, response.length());
                    exchange.getResponseBody().write(response.getBytes());
                } catch (Exception e) {
                    e.printStackTrace();
                    exchange.sendResponseHeaders(500, 0);
                }
            }
            exchange.getResponseBody().close();
        }
    }

    // ============ APPOINTMENT HANDLER ============
    static class AppointmentHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            if ("GET".equals(exchange.getRequestMethod())) {
                try {
                    Connection conn = DatabaseConnection.getConnection();
                    Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery(
                        "SELECT a.*, p.first_name as pat_first, p.last_name as pat_last, " +
                        "d.first_name as doc_first, d.last_name as doc_last " +
                        "FROM appointments a " +
                        "JOIN patients p ON a.pat_id = p.pat_id " +
                        "JOIN doctors d ON a.doc_id = d.doc_id " +
                        "ORDER BY a.app_date, a.app_time"
                    );
                    
                    StringBuilder json = new StringBuilder("[");
                    int count = 0;
                    while (rs.next()) {
                        if (count > 0) json.append(",");
                        json.append("{")
                            .append("\"id\":").append(rs.getInt("app_id")).append(",")
                            .append("\"patId\":").append(rs.getInt("pat_id")).append(",")
                            .append("\"docId\":").append(rs.getInt("doc_id")).append(",")
                            .append("\"patientName\":\"").append(rs.getString("pat_first")).append(" ").append(rs.getString("pat_last")).append("\",")
                            .append("\"doctorName\":\"").append(rs.getString("doc_first")).append(" ").append(rs.getString("doc_last")).append("\",")
                            .append("\"appDate\":\"").append(rs.getDate("app_date")).append("\",")
                            .append("\"appTime\":\"").append(rs.getTime("app_time")).append("\",")
                            .append("\"status\":\"").append(rs.getString("status")).append("\"")
                            .append("}");
                        count++;
                    }
                    json.append("]");
                    
                    byte[] bytes = json.toString().getBytes();
                    exchange.sendResponseHeaders(200, bytes.length);
                    exchange.getResponseBody().write(bytes);
                } catch (Exception e) {
                    e.printStackTrace();
                    exchange.sendResponseHeaders(500, 0);
                }
            } else if ("POST".equals(exchange.getRequestMethod())) {
                try {
                    Map<String, String> params = parseRequestBody(exchange);
                    Connection conn = DatabaseConnection.getConnection();
                    
                    // Call stored procedure
                    CallableStatement cstmt = conn.prepareCall("{call sp_book_appointment(?, ?, ?, ?)}");
                    cstmt.setInt(1, Integer.parseInt(params.get("patId")));
                    cstmt.setInt(2, Integer.parseInt(params.get("docId")));
                    cstmt.setDate(3, java.sql.Date.valueOf(params.get("appDate")));
                    cstmt.setTime(4, java.sql.Time.valueOf(params.get("appTime") + ":00"));
                    
                    cstmt.execute();
                    
                    String response = "{\"status\":\"success\"}";
                    exchange.sendResponseHeaders(200, response.length());
                    exchange.getResponseBody().write(response.getBytes());
                } catch (Exception e) {
                    e.printStackTrace();
                    exchange.sendResponseHeaders(500, 0);
                }
            }
            exchange.getResponseBody().close();
        }
    }

    // ============ MEDICINE HANDLER ============
    static class MedicineHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            if ("GET".equals(exchange.getRequestMethod())) {
                try {
                    Connection conn = DatabaseConnection.getConnection();
                    Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery("SELECT * FROM medicines");
                    
                    StringBuilder json = new StringBuilder("[");
                    int count = 0;
                    while (rs.next()) {
                        if (count > 0) json.append(",");
                        json.append("{")
                            .append("\"id\":").append(rs.getInt("med_id")).append(",")
                            .append("\"name\":\"").append(rs.getString("med_name")).append("\",")
                            .append("\"stock\":").append(rs.getInt("stock")).append(",")
                            .append("\"price\":").append(rs.getDouble("price")).append("}");
                        count++;
                    }
                    json.append("]");
                    
                    byte[] bytes = json.toString().getBytes();
                    exchange.sendResponseHeaders(200, bytes.length);
                    exchange.getResponseBody().write(bytes);
                } catch (Exception e) {
                    e.printStackTrace();
                    exchange.sendResponseHeaders(500, 0);
                }
            } else if ("POST".equals(exchange.getRequestMethod())) {
                try {
                    Map<String, String> params = parseRequestBody(exchange);
                    Connection conn = DatabaseConnection.getConnection();
                    PreparedStatement pstmt = conn.prepareStatement(
                        "INSERT INTO medicines (med_name, stock, price) VALUES (?, ?, ?)"
                    );
                    pstmt.setString(1, params.get("name"));
                    pstmt.setInt(2, Integer.parseInt(params.get("stock")));
                    pstmt.setDouble(3, Double.parseDouble(params.get("price")));
                    
                    int rows = pstmt.executeUpdate();
                    String response = rows > 0 ? "{\"status\":\"success\"}" : "{\"status\":\"error\"}";
                    exchange.sendResponseHeaders(200, response.length());
                    exchange.getResponseBody().write(response.getBytes());
                } catch (Exception e) {
                    e.printStackTrace();
                    exchange.sendResponseHeaders(500, 0);
                }
            }
            exchange.getResponseBody().close();
        }
    }

    // ============ WARD HANDLER ============
    static class WardHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            if ("GET".equals(exchange.getRequestMethod())) {
                try {
                    Connection conn = DatabaseConnection.getConnection();
                    Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery(
                        "SELECT w.*, ra.pat_id, p.first_name, p.last_name " +
                        "FROM wards w " +
                        "LEFT JOIN room_assignments ra ON w.ward_id = ra.room_id AND ra.check_out IS NULL " +
                        "LEFT JOIN patients p ON ra.pat_id = p.pat_id"
                    );
                    
                    StringBuilder json = new StringBuilder("[");
                    int count = 0;
                    while (rs.next()) {
                        if (count > 0) json.append(",");
                        Integer patId = rs.getObject("pat_id", Integer.class);
                        String patientName = rs.getString("first_name");
                        
                        json.append("{")
                            .append("\"id\":").append(rs.getInt("ward_id")).append(",")
                            .append("\"name\":\"").append(rs.getString("ward_name")).append("\",")
                            .append("\"capacity\":").append(rs.getInt("capacity")).append(",")
                            .append("\"patientId\":").append(patId == null ? "null" : patId).append(",")
                            .append("\"patientName\":\"").append(patientName != null ? patientName + " " + rs.getString("last_name") : "").append("\"")
                            .append("}");
                        count++;
                    }
                    json.append("]");
                    
                    byte[] bytes = json.toString().getBytes();
                    exchange.sendResponseHeaders(200, bytes.length);
                    exchange.getResponseBody().write(bytes);
                } catch (Exception e) {
                    e.printStackTrace();
                    exchange.sendResponseHeaders(500, 0);
                }
            } else if ("POST".equals(exchange.getRequestMethod())) {
                try {
                    Map<String, String> params = parseRequestBody(exchange);
                    Connection conn = DatabaseConnection.getConnection();
                    
                    // Admit patient to ward
                    PreparedStatement pstmt = conn.prepareStatement(
                        "INSERT INTO room_assignments (pat_id, room_id, check_in) VALUES (?, ?, ?)"
                    );
                    pstmt.setInt(1, Integer.parseInt(params.get("patId")));
                    pstmt.setInt(2, Integer.parseInt(params.get("wardId")));
                    pstmt.setDate(3, new java.sql.Date(System.currentTimeMillis()));
                    
                    int rows = pstmt.executeUpdate();
                    String response = rows > 0 ? "{\"status\":\"success\"}" : "{\"status\":\"error\"}";
                    exchange.sendResponseHeaders(200, response.length());
                    exchange.getResponseBody().write(response.getBytes());
                } catch (Exception e) {
                    e.printStackTrace();
                    exchange.sendResponseHeaders(500, 0);
                }
            }
            exchange.getResponseBody().close();
        }
    }

    // ============ REPORT HANDLER ============
    static class ReportHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            PDFReportGenerator generator = new PDFReportGenerator();
            boolean success = generator.generateSimpleReport("reports/hospital_report.pdf", 
                "Hospital Management Report", "Generated: " + new java.util.Date());
            
            String response = success ? "{\"status\":\"Report Generated\"}" : "{\"status\":\"Error\"}";
            byte[] bytes = response.getBytes();
            exchange.sendResponseHeaders(200, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.getResponseBody().close();
        }
    }

    // Helper Methods
    private static Map<String, String> parseRequestBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        String body = new String(is.readAllBytes());
        return parseFormData(body);
    }

    private static Map<String, String> parseFormData(String body) throws UnsupportedEncodingException {
        Map<String, String> map = new HashMap<>();
        String[] pairs = body.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            String key = URLDecoder.decode(pair.substring(0, idx), "UTF-8");
            String value = URLDecoder.decode(pair.substring(idx + 1), "UTF-8");
            map.put(key, value);
        }
        return map;
    }
}
