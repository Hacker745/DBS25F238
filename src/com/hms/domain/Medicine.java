package com.hms.domain;

public class Medicine {
    private int medId, stock;
    private String medName;
    private double price;

    public Medicine() {}
    public Medicine(String medName, int stock, double price) {
        this.medName = medName; this.stock = stock; this.price = price;
    }

    public int getMedId() { return medId; } public void setMedId(int medId) { this.medId = medId; }
    public String getMedName() { return medName; } public void setMedName(String medName) { this.medName = medName; }
    public int getStock() { return stock; } public void setStock(int stock) { this.stock = stock; }
    public double getPrice() { return price; } public void setPrice(double price) { this.price = price; }
}