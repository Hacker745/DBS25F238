// ============ DATA WITH LOCALSTORAGE (Persists on Refresh) ============

// Load data from browser storage, or use default mock data if it's the first time
let patients = JSON.parse(localStorage.getItem('hms_patients')) || [
    { id: 1, firstName: "John", lastName: "Doe", phone: "1234567890", gender: "M", dob: "1990-05-15", bloodType: "O+", address: "123 Main St" },
    { id: 2, firstName: "Jane", lastName: "Smith", phone: "0987654321", gender: "F", dob: "1985-08-20", bloodType: "A+", address: "456 Oak Ave" }
];

let doctors = JSON.parse(localStorage.getItem('hms_doctors')) || [
    { id: 1, firstName: "Ahmed", lastName: "Khan", specialization: "Cardiology", phone: "1112223333" },
    { id: 2, firstName: "Sarah", lastName: "Ali", specialization: "Pediatrics", phone: "4445556666" }
];

let appointments = JSON.parse(localStorage.getItem('hms_appointments')) || [
    { id: 1, patId: 1, docId: 1, patientName: "John Doe", doctorName: "Dr. Ahmed Khan", appDate: "2026-06-20", appTime: "10:00:00", status: "Scheduled" }
];

let medicines = JSON.parse(localStorage.getItem('hms_medicines')) || [
    { id: 1, name: "Paracetamol", stock: 100, price: 50.00 },
    { id: 2, name: "Amoxicillin", stock: 50, price: 120.00 }
];

let wards = JSON.parse(localStorage.getItem('hms_wards')) || [
    { id: 1, name: "General Ward A", capacity: 10, patientId: null, patientName: "" },
    { id: 2, name: "ICU Ward 1", capacity: 5, patientId: null, patientName: "" },
    { id: 3, name: "Private Ward B", capacity: 3, patientId: 1, patientName: "John Doe" }
];

// This function saves all data to the browser's local storage
function saveData() {
    localStorage.setItem('hms_patients', JSON.stringify(patients));
    localStorage.setItem('hms_doctors', JSON.stringify(doctors));
    localStorage.setItem('hms_appointments', JSON.stringify(appointments));
    localStorage.setItem('hms_medicines', JSON.stringify(medicines));
    localStorage.setItem('hms_wards', JSON.stringify(wards));
}

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', function() {
    renderPatientTable();
    renderDoctorsTable();
    renderAppointmentsTable();
    renderMedicinesTable();
    renderWardsTable();
    showPanel('tablePanel');
});

// ============ PATIENT FUNCTIONS ============

function renderPatientTable() {
    const tbody = document.getElementById('patientTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    patients.forEach(p => {
        const row = `
            <tr>
                <td>${p.id}</td>
                <td>${p.firstName} ${p.lastName}</td>
                <td>${p.phone}</td>
                <td>${p.gender}</td>
                <td>
                    <button class="btn btn-edit" onclick="editPatient(${p.id})">Edit</button>
                    <button class="btn btn-delete" onclick="deletePatient(${p.id})">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function editPatient(id) {
    const patient = patients.find(p => p.id === id);
    if (patient) {
        document.getElementById('formTitle').innerText = "Edit Patient";
        document.getElementById('submitBtn').innerText = "Update Patient";
        
        document.getElementById('patientId').value = patient.id;
        document.getElementById('firstName').value = patient.firstName;
        document.getElementById('lastName').value = patient.lastName;
        document.getElementById('dob').value = patient.dob;
        document.getElementById('bloodType').value = patient.bloodType;
        document.getElementById('phone').value = patient.phone;
        document.getElementById('address').value = patient.address;
        
        const genderRadios = document.getElementsByName('gender');
        for (let radio of genderRadios) {
            if (radio.value === patient.gender) {
                radio.checked = true;
                break;
            }
        }
        
        showPanel('patientForm');
    }
}

function deletePatient(id) {
    if (confirm("Are you sure you want to delete this patient?")) {
        patients = patients.filter(p => p.id !== id);
        renderPatientTable();
        saveData(); // AUTOSAVE
        alert("Patient deleted successfully!");
    }
}

function handlePatientSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('patientId').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dob = document.getElementById('dob').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const bloodType = document.getElementById('bloodType').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    if (id) {
        const index = patients.findIndex(p => p.id == id);
        if (index !== -1) {
            patients[index] = { id: parseInt(id), firstName, lastName, dob, gender, bloodType, phone, address };
            alert("Patient updated successfully!");
        }
    } else {
        const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
        patients.push({ id: newId, firstName, lastName, dob, gender, bloodType, phone, address });
        alert("Patient added successfully!");
    }
    
    renderPatientTable();
    saveData(); // AUTOSAVE
    showPanel('tablePanel');
}

function openAddPatientForm() {
    document.getElementById('formTitle').innerText = "Add New Patient";
    document.getElementById('submitBtn').innerText = "Save Patient";
    document.getElementById('patientForm').reset();
    document.getElementById('patientId').value = "";
    showPanel('patientForm');
}

// ============ DOCTOR FUNCTIONS ============

function renderDoctorsTable() {
    const tbody = document.getElementById('doctorsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    doctors.forEach(d => {
        const row = `
            <tr>
                <td>${d.id}</td>
                <td>Dr. ${d.firstName} ${d.lastName}</td>
                <td>${d.specialization}</td>
                <td>${d.phone}</td>
                <td>
                    <button class="btn btn-edit" onclick="editDoctor(${d.id})">Edit</button>
                    <button class="btn btn-delete" onclick="deleteDoctor(${d.id})">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function editDoctor(id) {
    const doctor = doctors.find(d => d.id === id);
    if (doctor) {
        document.getElementById('docFormTitle').innerText = "Edit Doctor";
        document.getElementById('docSubmitBtn').innerText = "Update Doctor";
        
        document.getElementById('doctorId').value = doctor.id;
        document.getElementById('docFirstName').value = doctor.firstName;
        document.getElementById('docLastName').value = doctor.lastName;
        document.getElementById('docSpecialization').value = doctor.specialization;
        document.getElementById('docPhone').value = doctor.phone;
        
        showPanel('doctorForm');
    }
}

function deleteDoctor(id) {
    if (confirm("Are you sure you want to delete this doctor?")) {
        doctors = doctors.filter(d => d.id !== id);
        renderDoctorsTable();
        saveData(); // AUTOSAVE
        alert("Doctor deleted successfully!");
    }
}

function handleDoctorSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('doctorId').value;
    const firstName = document.getElementById('docFirstName').value;
    const lastName = document.getElementById('docLastName').value;
    const specialization = document.getElementById('docSpecialization').value;
    const phone = document.getElementById('docPhone').value;

    if (id) {
        const index = doctors.findIndex(d => d.id == id);
        if (index !== -1) {
            doctors[index] = { id: parseInt(id), firstName, lastName, specialization, phone };
            alert("Doctor updated successfully!");
        }
    } else {
        const newId = doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1;
        doctors.push({ id: newId, firstName, lastName, specialization, phone });
        alert("Doctor added successfully!");
    }
    
    renderDoctorsTable();
    saveData(); // AUTOSAVE
    showPanel('doctors');
}

function openAddDoctorForm() {
    document.getElementById('docFormTitle').innerText = "Add New Doctor";
    document.getElementById('docSubmitBtn').innerText = "Save Doctor";
    document.getElementById('doctorForm').reset();
    document.getElementById('doctorId').value = "";
    showPanel('doctorForm');
}

// ============ APPOINTMENT FUNCTIONS ============

function renderAppointmentsTable() {
    const tbody = document.getElementById('appointmentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    appointments.forEach(a => {
        const row = `
            <tr>
                <td>${a.id}</td>
                <td>${a.patientName}</td>
                <td>${a.doctorName}</td>
                <td>${a.appDate}</td>
                <td>${a.appTime}</td>
                <td><span style="color: green; font-weight: bold;">${a.status}</span></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function openAddAppointmentForm() {
    // Populate patient and doctor dropdowns
    const patientSelect = document.getElementById('appPatient');
    const doctorSelect = document.getElementById('appDoctor');
    
    patientSelect.innerHTML = '<option value="">-- Select Patient --</option>';
    patients.forEach(p => {
        patientSelect.innerHTML += `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`;
    });
    
    doctorSelect.innerHTML = '<option value="">-- Select Doctor --</option>';
    doctors.forEach(d => {
        doctorSelect.innerHTML += `<option value="${d.id}">Dr. ${d.firstName} ${d.lastName} (${d.specialization})</option>`;
    });
    
    showPanel('appointmentForm');
}

function handleAppointmentSubmit(event) {
    event.preventDefault();
    
    const patId = document.getElementById('appPatient').value;
    const docId = document.getElementById('appDoctor').value;
    const appDate = document.getElementById('appDate').value;
    const appTime = document.getElementById('appTime').value;
    
    // Find names
    const patient = patients.find(p => p.id == patId);
    const doctor = doctors.find(d => d.id == docId);
    
    const newId = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
    appointments.push({
        id: newId,
        patId: parseInt(patId),
        docId: parseInt(docId),
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Unknown",
        doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Unknown",
        appDate: appDate,
        appTime: appTime + ":00",
        status: "Scheduled"
    });
    
    alert("Appointment booked successfully!");
    renderAppointmentsTable();
    saveData(); // AUTOSAVE
    document.getElementById('appointmentForm').reset();
    showPanel('appointments');
}

// ============ MEDICINE FUNCTIONS ============

function renderMedicinesTable() {
    const tbody = document.getElementById('medicinesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    medicines.forEach(m => {
        const row = `
            <tr>
                <td>${m.id}</td>
                <td>${m.name}</td>
                <td>${m.stock}</td>
                <td>PKR ${m.price.toFixed(2)}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function openAddMedicineForm() {
    showPanel('medicineForm');
}

function handleMedicineSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('medName').value;
    const stock = document.getElementById('medStock').value;
    const price = document.getElementById('medPrice').value;
    
    const newId = medicines.length > 0 ? Math.max(...medicines.map(m => m.id)) + 1 : 1;
    medicines.push({
        id: newId,
        name: name,
        stock: parseInt(stock),
        price: parseFloat(price)
    });
    
    alert("Medicine added successfully!");
    renderMedicinesTable();
    saveData(); // AUTOSAVE
    document.getElementById('medicineForm').reset();
    showMedicinesSection();
}

// ============ WARD FUNCTIONS ============

function renderWardsTable() {
    const tbody = document.getElementById('wardsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    wards.forEach(w => {
        const status = w.patientId !== null 
            ? '<span style="color: red; font-weight: bold;">Occupied</span>' 
            : '<span style="color: green; font-weight: bold;">Available</span>';
        
        const action = w.patientId === null 
            ? `<button class="btn" onclick="openAdmitForm(${w.id})">Admit Patient</button>` 
            : `<button class="btn btn-cancel" onclick="dischargePatient(${w.id})">Discharge</button>`;
        
        const row = `
            <tr>
                <td>${w.id}</td>
                <td>${w.name}</td>
                <td>${w.capacity}</td>
                <td>${status}</td>
                <td>${w.patientName || '-'}</td>
                <td>${action}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function openAdmitForm(wardId) {
    // 1. Populate Patient Dropdown
    const patientSelect = document.getElementById('admitPatient');
    patientSelect.innerHTML = '<option value="">-- Select Patient --</option>';
    patients.forEach(p => {
        patientSelect.innerHTML += `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`;
    });
    
    // 2. Populate Ward Dropdown with actual options
    const wardSelect = document.getElementById('admitWard');
    wardSelect.innerHTML = '<option value="">-- Select Ward --</option>';
    
    wards.forEach(w => {
        wardSelect.innerHTML += `<option value="${w.id}">${w.name} (Capacity: ${w.capacity})</option>`;
    });

    // 3. Pre-select the specific ward if the user clicked "Admit" from the table
    if (wardId) {
        wardSelect.value = wardId;
    }
    
    showPanel('admitPatient');
}

function handleAdmitSubmit(event) {
    event.preventDefault();
    
    const patId = document.getElementById('admitPatient').value;
    const wardId = document.getElementById('admitWard').value;
    
    // Find patient
    const patient = patients.find(p => p.id == patId);
    
    // Update ward
    const ward = wards.find(w => w.id == wardId);
    if (ward && patient) {
        ward.patientId = parseInt(patId);
        ward.patientName = `${patient.firstName} ${patient.lastName}`;
    }
    
    alert("Patient admitted successfully!");
    renderWardsTable();
    saveData(); // AUTOSAVE
    document.getElementById('admitForm').reset();
    showWardsSection();
}

function dischargePatient(wardId) {
    if (confirm("Discharge this patient?")) {
        const ward = wards.find(w => w.id == wardId);
        if (ward) {
            ward.patientId = null;
            ward.patientName = "";
        }
        alert("Patient discharged successfully!");
        renderWardsTable();
        saveData(); // AUTOSAVE
    }
}

// ============ UI NAVIGATION ============

function showMedicinesSection() {
    document.getElementById('medicinesSection').style.display = 'block';
    document.getElementById('wardsSection').style.display = 'none';
}

function showWardsSection() {
    document.getElementById('medicinesSection').style.display = 'none';
    document.getElementById('wardsSection').style.display = 'block';
}

function showPanel(panelName) {
    // Hide all panels
    const allPanels = ['loginPanel', 'patientFormPanel', 'tablePanel', 'doctorsPanel', 
                       'doctorFormPanel', 'appointmentsPanel', 'appointmentFormPanel',
                       'medicinesPanel', 'medicineFormPanel', 'admitPatientPanel', 'reportsPanel'];
    
    allPanels.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Show requested panel
    if (panelName === 'login') document.getElementById('loginPanel').style.display = 'block';
    if (panelName === 'patientForm') document.getElementById('patientFormPanel').style.display = 'block';
    if (panelName === 'tablePanel' || panelName === 'dashboard') {
        document.getElementById('tablePanel').style.display = 'block';
        renderPatientTable();
    }
    if (panelName === 'doctors') {
        document.getElementById('doctorsPanel').style.display = 'block';
        renderDoctorsTable();
    }
    if (panelName === 'doctorForm') document.getElementById('doctorFormPanel').style.display = 'block';
    if (panelName === 'appointments') {
        document.getElementById('appointmentsPanel').style.display = 'block';
        renderAppointmentsTable();
    }
    if (panelName === 'appointmentForm') document.getElementById('appointmentFormPanel').style.display = 'block';
    if (panelName === 'medicines') {
        document.getElementById('medicinesPanel').style.display = 'block';
        showMedicinesSection();
        renderMedicinesTable();
    }
    if (panelName === 'medicineForm') document.getElementById('medicineFormPanel').style.display = 'block';
    if (panelName === 'admitPatient') document.getElementById('admitPatientPanel').style.display = 'block';
    if (panelName === 'reports') document.getElementById('reportsPanel').style.display = 'block';
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        showPanel('login');
    }
}

// ============ REPORT FUNCTIONS (Working Downloads) ============

function generateReport(type) {
    let reportContent = "";
    let filename = "";
    
    switch(type) {
        case 'patients':
            reportContent = "HOSPITAL MANAGEMENT SYSTEM\n";
            reportContent += "PATIENT LIST REPORT\n";
            reportContent += "Generated: " + new Date().toLocaleString() + "\n";
            reportContent += "==========================================\n\n";
            reportContent += `Total Patients: ${patients.length}\n\n`;
            patients.forEach(p => {
                reportContent += `ID: ${p.id}\n`;
                reportContent += `Name: ${p.firstName} ${p.lastName}\n`;
                reportContent += `DOB: ${p.dob}\n`;
                reportContent += `Gender: ${p.gender}\n`;
                reportContent += `Blood Type: ${p.bloodType}\n`;
                reportContent += `Phone: ${p.phone}\n`;
                reportContent += `Address: ${p.address}\n`;
                reportContent += "------------------------------------------\n";
            });
            filename = "patient_list_report.txt";
            break;
            
        case 'doctors':
            reportContent = "HOSPITAL MANAGEMENT SYSTEM\n";
            reportContent += "DOCTORS LIST REPORT\n";
            reportContent += "Generated: " + new Date().toLocaleString() + "\n";
            reportContent += "==========================================\n\n";
            reportContent += `Total Doctors: ${doctors.length}\n\n`;
            doctors.forEach(d => {
                reportContent += `ID: ${d.id}\n`;
                reportContent += `Name: Dr. ${d.firstName} ${d.lastName}\n`;
                reportContent += `Specialization: ${d.specialization}\n`;
                reportContent += `Phone: ${d.phone}\n`;
                reportContent += "------------------------------------------\n";
            });
            filename = "doctors_list_report.txt";
            break;
            
        case 'appointments':
            reportContent = "HOSPITAL MANAGEMENT SYSTEM\n";
            reportContent += "APPOINTMENTS REPORT\n";
            reportContent += "Generated: " + new Date().toLocaleString() + "\n";
            reportContent += "==========================================\n\n";
            reportContent += `Total Appointments: ${appointments.length}\n\n`;
            appointments.forEach(a => {
                reportContent += `Appointment ID: ${a.id}\n`;
                reportContent += `Patient: ${a.patientName}\n`;
                reportContent += `Doctor: ${a.doctorName}\n`;
                reportContent += `Date: ${a.appDate}\n`;
                reportContent += `Time: ${a.appTime}\n`;
                reportContent += `Status: ${a.status}\n`;
                reportContent += "------------------------------------------\n";
            });
            filename = "appointments_report.txt";
            break;
            
        case 'medicines':
            reportContent = "HOSPITAL MANAGEMENT SYSTEM\n";
            reportContent += "MEDICINE INVENTORY REPORT\n";
            reportContent += "Generated: " + new Date().toLocaleString() + "\n";
            reportContent += "==========================================\n\n";
            reportContent += `Total Medicines: ${medicines.length}\n\n`;
            let totalStock = 0;
            let totalValue = 0;
            medicines.forEach(m => {
                reportContent += `ID: ${m.id}\n`;
                reportContent += `Name: ${m.name}\n`;
                reportContent += `Stock: ${m.stock} units\n`;
                reportContent += `Price: PKR ${m.price.toFixed(2)}\n`;
                reportContent += `Value: PKR ${(m.stock * m.price).toFixed(2)}\n`;
                reportContent += "------------------------------------------\n";
                totalStock += m.stock;
                totalValue += (m.stock * m.price);
            });
            reportContent += `\nTotal Stock Units: ${totalStock}\n`;
            reportContent += `Total Inventory Value: PKR ${totalValue.toFixed(2)}\n`;
            filename = "medicine_inventory_report.txt";
            break;
            
        default:
            reportContent = "Unknown report type";
            filename = "report.txt";
    }
    
    // Download the file
    downloadFile(reportContent, filename);
}

function downloadFile(content, filename) {
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    
    // Append to body, click, and remove
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show success message
    alert(`Report downloaded: ${filename}\nCheck your Downloads folder!`);
}

function generatePDFReport() {
    // Create a simple PDF-like text report
    let pdfContent = "HOSPITAL MANAGEMENT SYSTEM\n";
    pdfContent += "COMPREHENSIVE REPORT\n";
    pdfContent += "Generated: " + new Date().toLocaleString() + "\n";
    pdfContent += "==========================================\n\n";
    
    pdfContent += `SUMMARY:\n`;
    pdfContent += `- Total Patients: ${patients.length}\n`;
    pdfContent += `- Total Doctors: ${doctors.length}\n`;
    pdfContent += `- Total Appointments: ${appointments.length}\n`;
    pdfContent += `- Total Medicines: ${medicines.length}\n`;
    pdfContent += `- Total Wards: ${wards.length}\n\n`;
    
    pdfContent += "Note: This is a text version. PDF generation requires Java backend.\n";
    
    downloadFile(pdfContent, "hospital_summary_report.txt");
}
