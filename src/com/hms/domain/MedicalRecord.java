package com.hms.domain;
import java.sql.Timestamp;

public class MedicalRecord {
    private int recId, patId, docId;
    private String diagnosis, treatmentPlan;
    private Timestamp recDate;

    public MedicalRecord() {}
    public MedicalRecord(int patId, int docId, String diagnosis, String treatmentPlan) {
        this.patId = patId; this.docId = docId; this.diagnosis = diagnosis; this.treatmentPlan = treatmentPlan;
    }

    public int getRecId() { return recId; } public void setRecId(int recId) { this.recId = recId; }
    public int getPatId() { return patId; } public void setPatId(int patId) { this.patId = patId; }
    public int getDocId() { return docId; } public void setDocId(int docId) { this.docId = docId; }
    public String getDiagnosis() { return diagnosis; } public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public String getTreatmentPlan() { return treatmentPlan; } public void setTreatmentPlan(String treatmentPlan) { this.treatmentPlan = treatmentPlan; }
    public Timestamp getRecDate() { return recDate; } public void setRecDate(Timestamp recDate) { this.recDate = recDate; }
}