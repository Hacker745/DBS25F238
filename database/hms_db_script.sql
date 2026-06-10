CREATE DATABASE hms_db;
USE hms_db;

-- 1. Departments
CREATE TABLE departments (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(50) NOT NULL UNIQUE, -- Constraint 1: UNIQUE
    location VARCHAR(100) NOT NULL
);

-- 2. Doctors
CREATE TABLE doctors (
    doc_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(50) NOT NULL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL, -- Constraint 2: FK
    phone VARCHAR(15) UNIQUE NOT NULL -- Constraint 3: UNIQUE & NOT NULL
);

-- 3. Patients
CREATE TABLE patients (
    pat_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('M', 'F', 'O') NOT NULL, -- Constraint 4: ENUM (acts as CHECK)
    blood_type VARCHAR(5),
    phone VARCHAR(15) NOT NULL,
    address TEXT NOT NULL
);

-- 4. Rooms
CREATE TABLE rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(10) NOT NULL UNIQUE,
    room_type ENUM('General', 'Private', 'ICU') NOT NULL,
    status ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available', -- Constraint 5: DEFAULT
    price_per_day DECIMAL(10,2) NOT NULL CHECK (price_per_day > 0) -- Constraint 6: CHECK
);

-- 5. Appointments
CREATE TABLE appointments (
    app_id INT PRIMARY KEY AUTO_INCREMENT,
    pat_id INT NOT NULL,
    doc_id INT NOT NULL,
    app_date DATE NOT NULL,
    app_time TIME NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    FOREIGN KEY (pat_id) REFERENCES patients(pat_id) ON DELETE CASCADE, -- Constraint 7: FK Cascade
    FOREIGN KEY (doc_id) REFERENCES doctors(doc_id) ON DELETE CASCADE
);

-- 6. Medical Records
CREATE TABLE medical_records (
    rec_id INT PRIMARY KEY AUTO_INCREMENT,
    pat_id INT NOT NULL,
    doc_id INT NOT NULL,
    diagnosis TEXT NOT NULL,
    treatment_plan TEXT NOT NULL,
    rec_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- Constraint 8: DEFAULT Timestamp
    FOREIGN KEY (pat_id) REFERENCES patients(pat_id),
    FOREIGN KEY (doc_id) REFERENCES doctors(doc_id)
);

-- 7. Medicines
CREATE TABLE medicines (
    med_id INT PRIMARY KEY AUTO_INCREMENT,
    med_name VARCHAR(100) NOT NULL UNIQUE,
    stock INT NOT NULL CHECK (stock >= 0), -- Constraint 9: CHECK
    price DECIMAL(10,2) NOT NULL
);

-- 8. Prescriptions
CREATE TABLE prescriptions (
    pres_id INT PRIMARY KEY AUTO_INCREMENT,
    rec_id INT NOT NULL,
    med_id INT NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    duration_days INT NOT NULL CHECK (duration_days > 0),
    FOREIGN KEY (rec_id) REFERENCES medical_records(rec_id),
    FOREIGN KEY (med_id) REFERENCES medicines(med_id)
);

-- 9. Billings
CREATE TABLE billings (
    bill_id INT PRIMARY KEY AUTO_INCREMENT,
    pat_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    bill_date DATE NOT NULL,
    status ENUM('Pending', 'Paid', 'Overdue') DEFAULT 'Pending',
    FOREIGN KEY (pat_id) REFERENCES patients(pat_id)
);

-- 10. Payments
CREATE TABLE payments (
    pay_id INT PRIMARY KEY AUTO_INCREMENT,
    bill_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('Cash', 'Card', 'Insurance') NOT NULL,
    FOREIGN KEY (bill_id) REFERENCES billings(bill_id)
);

-- 11. Insurance
CREATE TABLE insurance (
    ins_id INT PRIMARY KEY AUTO_INCREMENT,
    pat_id INT NOT NULL UNIQUE,
    provider_name VARCHAR(100) NOT NULL,
    policy_number VARCHAR(50) NOT NULL UNIQUE,
    coverage_limit DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pat_id) REFERENCES patients(pat_id)
);

-- 12. Staff (Non-doctor)
CREATE TABLE staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('Nurse', 'Admin', 'Receptionist', 'Janitor') NOT NULL,
    dept_id INT,
    hire_date DATE NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- 13. Wards
CREATE TABLE wards (
    ward_id INT PRIMARY KEY AUTO_INCREMENT,
    ward_name VARCHAR(50) NOT NULL UNIQUE,
    capacity INT NOT NULL CHECK (capacity > 0) -- Constraint 10: CHECK
);

-- 14. Room Assignments (Admissions)
CREATE TABLE room_assignments (
    assign_id INT PRIMARY KEY AUTO_INCREMENT,
    pat_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE,
    FOREIGN KEY (pat_id) REFERENCES patients(pat_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- 15. Audit Logs
CREATE TABLE audit_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action_type VARCHAR(10) NOT NULL,
    action_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- View 1: Patient Appointments with Doctor Names
CREATE VIEW vw_patient_appointments AS
SELECT p.first_name, p.last_name, d.first_name AS doc_first, d.last_name AS doc_last, a.app_date, a.app_time
FROM patients p JOIN appointments a ON p.pat_id = a.pat_id JOIN doctors d ON a.doc_id = d.doc_id;

-- View 2: Available Rooms
CREATE VIEW vw_available_rooms AS
SELECT room_number, room_type, price_per_day FROM rooms WHERE status = 'Available';

-- View 3: Daily Revenue
CREATE VIEW vw_daily_revenue AS
SELECT payment_date, SUM(amount) AS total_revenue FROM payments GROUP BY payment_date;

-- View 4: Doctor Schedule
CREATE VIEW vw_doctor_schedule AS
SELECT d.first_name, d.specialization, a.app_date, a.app_time, p.first_name AS patient_name 
FROM doctors d JOIN appointments a ON d.doc_id = a.doc_id JOIN patients p ON a.pat_id = p.pat_id;

-- View 5: Patient Medical History
CREATE VIEW vw_patient_history AS
SELECT p.first_name, p.last_name, mr.diagnosis, mr.rec_date 
FROM patients p JOIN medical_records mr ON p.pat_id = mr.pat_id;


DELIMITER //

-- SP 1: Book an Appointment
CREATE PROCEDURE sp_book_appointment(
    IN p_pat_id INT, IN p_doc_id INT, IN p_app_date DATE, IN p_app_time TIME
)
BEGIN
    INSERT INTO appointments (pat_id, doc_id, app_date, app_time, status) 
    VALUES (p_pat_id, p_doc_id, p_app_date, p_app_time, 'Scheduled');
END //

-- SP 2: Generate Bill for a Patient
CREATE PROCEDURE sp_generate_bill(IN p_pat_id INT, IN p_amount DECIMAL(10,2))
BEGIN
    INSERT INTO billings (pat_id, total_amount, bill_date, status) 
    VALUES (p_pat_id, p_amount, CURDATE(), 'Pending');
END //

-- SP 3: Discharge Patient (Update room status)
CREATE PROCEDURE sp_discharge_patient(IN p_assign_id INT)
BEGIN
    DECLARE v_room_id INT;
    SELECT room_id INTO v_room_id FROM room_assignments WHERE assign_id = p_assign_id;
    UPDATE room_assignments SET check_out = CURDATE() WHERE assign_id = p_assign_id;
    UPDATE rooms SET status = 'Available' WHERE room_id = v_room_id;
END //

DELIMITER ;



DELIMITER //

-- Trigger 1: Auto-update room status when a patient is assigned
CREATE TRIGGER trg_update_room_status
AFTER INSERT ON room_assignments
FOR EACH ROW
BEGIN
    UPDATE rooms SET status = 'Occupied' WHERE room_id = NEW.room_id;
END //

-- Trigger 2: Log changes to Patient table
CREATE TRIGGER trg_log_patient_changes
AFTER UPDATE ON patients
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, record_id, action_type, action_time)
    VALUES ('patients', OLD.pat_id, 'UPDATE', NOW());
END //

DELIMITER ;