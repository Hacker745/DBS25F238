package com.hms.software;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import java.io.FileOutputStream;
import java.util.logging.Logger;

public class PDFReportGenerator {
    private static final Logger logger = Logger.getLogger(PDFReportGenerator.class.getName());

    // Generates a simple PDF report (Requirement: 10 PDF reports)
    public boolean generateSimpleReport(String filePath, String title, String content) {
        Document document = new Document();
        try {
            PdfWriter.getInstance(document, new FileOutputStream(filePath));
            document.open();
            document.add(new Paragraph(title, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));
            document.add(new Paragraph(" "));
            document.add(new Paragraph(content));
            document.close();
            logger.info("PDF Report generated: " + filePath);
            return true;
        } catch (Exception e) {
            logger.severe("Error generating PDF: " + e.getMessage());
            return false;
        }
    }
}