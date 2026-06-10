package com.hms.domain;
import java.sql.Date;

public class Patient {
    private int patId;
    private String firstName, lastName, gender, bloodType, phone, address;
    private Date dob;

    public Patient() {} // Empty constructor required for DAOs

    public Patient(String firstName, String lastName, Date dob, String gender, String bloodType, String phone, String address) {
        this.firstName = firstName; this.lastName = lastName; this.dob = dob;
        this.gender = gender; this.bloodType = bloodType; this.phone = phone; this.address = address;
    }

    // Getters and Setters
    public int getPatId() { return patId; }
    public void setPatId(int patId) { this.patId = patId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public Date getDob() { return dob; }
    public void setDob(Date dob) { this.dob = dob; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}