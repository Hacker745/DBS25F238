// Mock data for demonstration
let patients = [
    { id: 1, firstName: "John", lastName: "Doe", phone: "1234567890", gender: "M", dob: "1990-05-15", bloodType: "O+", address: "123 Main St" },
    { id: 2, firstName: "Jane", lastName: "Smith", phone: "0987654321", gender: "F", dob: "1985-08-20", bloodType: "A+", address: "456 Oak Ave" }
];

let doctors = [
    { id: 1, firstName: "Ahmed", lastName: "Khan", specialization: "Cardiology", phone: "1112223333" },
    { id: 2, firstName: "Sarah", lastName: "Ali", specialization: "Pediatrics", phone: "4445556666" }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderPatientTable();
    renderDoctorsTable();
    showPanel('tablePanel');
});

// THIS IS THE FUNCTION THAT CREATES THE TABLE WITH EDIT/DELETE BUTTONS
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

function openAddForm() {
    document.getElementById('formTitle').innerText = "Add New Patient";
    document.getElementById('submitBtn').innerText = "Save Patient";
    document.getElementById('patientForm').reset();
    document.getElementById('patientId').value = "";
    showPanel('patientForm');
}

function editPatient(id) {
    const patient = patients.find(p => p.id === id);
    if (patient) {
        document.getElementById('formTitle').innerText = "Edit Patient";
        document.getElementById('submitBtn').innerText = "Update Patient";
        
        document.getElementById('patientId').value = patient.id;
        document.getElementById('firstName').value = patient.firstName;
        document.getElementById('lastName').value = patient.lastName;
        document.getElementById('dob').value = patient.dob || "1990-01-01";
        document.getElementById('bloodType').value = patient.bloodType || "O+";
        document.getElementById('phone').value = patient.phone;
        document.getElementById('address').value = patient.address || "";
        
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

function handleFormSubmit(event) {
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
            patients[index] = { 
                id: parseInt(id), 
                firstName, 
                lastName, 
                dob,
                gender, 
                bloodType,
                phone,
                address 
            };
            alert("Patient updated successfully!");
        }
    } else {
        const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
        patients.push({ 
            id: newId, 
            firstName, 
            lastName, 
            dob,
            gender, 
            bloodType,
            phone,
            address 
        });
        alert("Patient added successfully!");
    }
    
    renderPatientTable();
    showPanel('tablePanel');
}

function deletePatient(id) {
    if (confirm("Are you sure you want to delete this patient?")) {
        patients = patients.filter(p => p.id !== id);
        renderPatientTable();
        alert("Patient deleted successfully!");
    }
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

function openAddDoctorForm() {
    document.getElementById('docFormTitle').innerText = "Add New Doctor";
    document.getElementById('docSubmitBtn').innerText = "Save Doctor";
    document.getElementById('doctorForm').reset();
    document.getElementById('doctorId').value = "";
    showPanel('doctorForm');
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

function handleDoctorFormSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('doctorId').value;
    const firstName = document.getElementById('docFirstName').value;
    const lastName = document.getElementById('docLastName').value;
    const specialization = document.getElementById('docSpecialization').value;
    const phone = document.getElementById('docPhone').value;

    if (id) {
        // Edit existing doctor
        const index = doctors.findIndex(d => d.id == id);
        if (index !== -1) {
            doctors[index] = { id: parseInt(id), firstName, lastName, specialization, phone };
            alert("Doctor updated successfully!");
        }
    } else {
        // Add new doctor
        const newId = doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1;
        doctors.push({ id: newId, firstName, lastName, specialization, phone });
        alert("Doctor added successfully!");
    }
    
    renderDoctorsTable();
    showPanel('doctors');
}

function deleteDoctor(id) {
    if (confirm("Are you sure you want to delete this doctor?")) {
        doctors = doctors.filter(d => d.id !== id);
        renderDoctorsTable();
        alert("Doctor deleted successfully!");
    }
}

function generateReport(reportType) {
    let reportContent = "HOSPITAL MANAGEMENT SYSTEM\n";
    let filename = "";
    
    if (reportType === 'patients') {
        reportContent += "PATIENT LIST REPORT\nGenerated: " + new Date().toLocaleString() + "\n========================\n\n";
        patients.forEach(p => {
            reportContent += `ID: ${p.id}\nName: ${p.firstName} ${p.lastName}\nPhone: ${p.phone}\n\n`;
        });
        filename = "patient_report.txt";
    } else if (reportType === 'doctors') {
        reportContent += "DOCTORS LIST REPORT\nGenerated: " + new Date().toLocaleString() + "\n========================\n\n";
        doctors.forEach(d => {
            reportContent += `ID: ${d.id}\nName: Dr. ${d.firstName} ${d.lastName}\nSpecialization: ${d.specialization}\n\n`;
        });
        filename = "doctors_report.txt";
    } else if (reportType === 'appointments') {
        reportContent += "APPOINTMENTS REPORT\nGenerated: " + new Date().toLocaleString() + "\n========================\n\n";
        reportContent += `Total Patients: ${patients.length}\nTotal Doctors: ${doctors.length}\n`;
        filename = "appointments_report.txt";
    }
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert(`Report generated: ${filename}`);
}

function showPanel(panelName) {
    // Hide all panels
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('patientFormPanel').style.display = 'none';
    document.getElementById('tablePanel').style.display = 'none';
    document.getElementById('doctorsPanel').style.display = 'none';
    document.getElementById('reportsPanel').style.display = 'none';
    document.getElementById('doctorFormPanel').style.display = 'none'; // Hide new form

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
    if (panelName === 'reports') document.getElementById('reportsPanel').style.display = 'block';
    if (panelName === 'doctorForm') document.getElementById('doctorFormPanel').style.display = 'block'; // Show new form
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        alert("Logged out successfully!");
        showPanel('login');
    }
}