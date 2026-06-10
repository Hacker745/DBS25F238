package com.hms.domain;

public class Department {
    private int deptId;
    private String deptName, location;

    public Department() {}
    public Department(String deptName, String location) { this.deptName = deptName; this.location = location; }

    public int getDeptId() { return deptId; } public void setDeptId(int deptId) { this.deptId = deptId; }
    public String getDeptName() { return deptName; } public void setDeptName(String deptName) { this.deptName = deptName; }
    public String getLocation() { return location; } public void setLocation(String location) { this.location = location; }
}