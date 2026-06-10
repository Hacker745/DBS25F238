package com.hms.domain;
import java.sql.Date;

public class Billing {
    private int billId, patId;
    private double totalAmount;
    private Date billDate;
    private String status;

    public Billing() {}
    public Billing(int patId, double totalAmount, Date billDate, String status) {
        this.patId = patId; this.totalAmount = totalAmount; this.billDate = billDate; this.status = status;
    }

    public int getBillId() { return billId; } public void setBillId(int billId) { this.billId = billId; }
    public int getPatId() { return patId; } public void setPatId(int patId) { this.patId = patId; }
    public double getTotalAmount() { return totalAmount; } public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public Date getBillDate() { return billDate; } public void setBillDate(Date billDate) { this.billDate = billDate; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
}