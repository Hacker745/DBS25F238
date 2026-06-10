package com.hms.domain;
import java.sql.Date;
import java.sql.Time;

public class Appointment {
    private int appId, patId, docId;
    private Date appDate;
    private Time appTime;
    private String status;

    public Appointment() {}
    public Appointment(int patId, int docId, Date appDate, Time appTime, String status) {
        this.patId = patId; this.docId = docId; this.appDate = appDate; this.appTime = appTime; this.status = status;
    }

    public int getAppId() { return appId; } public void setAppId(int appId) { this.appId = appId; }
    public int getPatId() { return patId; } public void setPatId(int patId) { this.patId = patId; }
    public int getDocId() { return docId; } public void setDocId(int docId) { this.docId = docId; }
    public Date getAppDate() { return appDate; } public void setAppDate(Date appDate) { this.appDate = appDate; }
    public Time getAppTime() { return appTime; } public void setAppTime(Time appTime) { this.appTime = appTime; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
}