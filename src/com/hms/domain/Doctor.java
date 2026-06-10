package com.hms.domain;

public class Doctor {
    private int docId, deptId;
    private String firstName, lastName, specialization, phone;

    public Doctor() {}
    public Doctor(String firstName, String lastName, String specialization, int deptId, String phone) {
        this.firstName = firstName; this.lastName = lastName; this.specialization = specialization;
        this.deptId = deptId; this.phone = phone;
    }

    public int getDocId() { return docId; } public void setDocId(int docId) { this.docId = docId; }
    public String getFirstName() { return firstName; } public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; } public void setLastName(String lastName) { this.lastName = lastName; }
    public String getSpecialization() { return specialization; } public void setSpecialization(String specialization) { this.specialization = specialization; }
    public int getDeptId() { return deptId; } public void setDeptId(int deptId) { this.deptId = deptId; }
    public String getPhone() { return phone; } public void setPhone(String phone) { this.phone = phone; }
}