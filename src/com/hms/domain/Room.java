package com.hms.domain;

public class Room {
    private int roomId;
    private String roomNumber, roomType, status;
    private double pricePerDay;

    public Room() {}
    public Room(String roomNumber, String roomType, String status, double pricePerDay) {
        this.roomNumber = roomNumber; this.roomType = roomType; this.status = status; this.pricePerDay = pricePerDay;
    }

    public int getRoomId() { return roomId; } public void setRoomId(int roomId) { this.roomId = roomId; }
    public String getRoomNumber() { return roomNumber; } public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getRoomType() { return roomType; } public void setRoomType(String roomType) { this.roomType = roomType; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public double getPricePerDay() { return pricePerDay; } public void setPricePerDay(double pricePerDay) { this.pricePerDay = pricePerDay; }
}