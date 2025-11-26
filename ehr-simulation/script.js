// ============================================
// EHR Simulation Interface - JavaScript
// ============================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeTabs();
    loadAllData();
    setCurrentDateTime();
    setupAutoSave();
    setupFormListeners();
});

// ============================================
// Tab Navigation
// ============================================

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// ============================================
// Data Persistence (localStorage)
// ============================================

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        showSaveIndicator();
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function loadData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

function showSaveIndicator() {
    const indicator = document.getElementById('save-indicator');
    indicator.classList.add('show');
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2000);
}

// ============================================
// Auto-save Setup
// ============================================

function setupAutoSave() {
    const inputs = document.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        if (input.id) {
            // Load saved value
            const savedValue = loadData(`field_${input.id}`);
            if (savedValue !== null && input.type !== 'checkbox' && input.type !== 'radio') {
                input.value = savedValue;
            } else if (input.type === 'checkbox' && savedValue !== null) {
                input.checked = savedValue;
            }

            // Save on change
            input.addEventListener('change', function () {
                if (this.type === 'checkbox') {
                    saveData(`field_${this.id}`, this.checked);
                } else {
                    saveData(`field_${this.id}`, this.value);
                }
            });
        }
    });
}

function setupFormListeners() {
    // Nursing diagnosis dropdown
    const diagnosisSelect = document.getElementById('nursing-diagnosis');
    if (diagnosisSelect) {
        diagnosisSelect.addEventListener('change', function () {
            const customGroup = document.getElementById('custom-diagnosis-group');
            if (this.value === 'other') {
                customGroup.style.display = 'block';
            } else {
                customGroup.style.display = 'none';
            }
        });
    }

    // BMI calculation
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const weightUnit = document.getElementById('weight-unit');
    const heightUnit = document.getElementById('height-unit');

    if (weightInput && heightInput) {
        [weightInput, heightInput, weightUnit, heightUnit].forEach(input => {
            if (input) {
                input.addEventListener('change', calculateBMI);
            }
        });
    }
}

function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const weightUnit = document.getElementById('weight-unit').value;
    const heightUnit = document.getElementById('height-unit').value;

    if (!weight || !height) return;

    // Convert to metric
    let weightKg = weight;
    let heightM = height;

    if (weightUnit === 'lbs') {
        weightKg = weight * 0.453592;
    }

    if (heightUnit === 'in') {
        heightM = height * 0.0254;
    } else if (heightUnit === 'cm') {
        heightM = height / 100;
    }

    const bmi = (weightKg / (heightM * heightM)).toFixed(1);
    document.getElementById('bmi').value = bmi;
}

// ============================================
// Utilities
// ============================================

function setCurrentDateTime() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

    // Set default dates/times for various fields
    const dateFields = ['vital-date', 'assessment-date', 'shift-date', 'med-start-date'];
    const timeFields = ['vital-time', 'assessment-time'];

    dateFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value) {
            field.value = dateStr;
        }
    });

    timeFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value) {
            field.value = timeStr;
        }
    });
}

function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString();
}

function clearForm(formId) {
    const container = document.getElementById(formId);
    if (!container) return;

    const inputs = container.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else if (input.type !== 'date' && input.type !== 'time') {
            input.value = '';
        }
        if (input.id) {
            saveData(`field_${input.id}`, input.type === 'checkbox' ? false : '');
        }
    });

    showSaveIndicator();
}

// ============================================
// Demographics Functions
// ============================================

function saveDemographics() {
    const demographics = {
        mrn: document.getElementById('mrn').value,
        lastName: document.getElementById('last-name').value,
        firstName: document.getElementById('first-name').value,
        middleName: document.getElementById('middle-name').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        allergies: document.getElementById('allergies').value
    };

    // Update header
    document.getElementById('header-patient-name').textContent =
        `${demographics.lastName}, ${demographics.firstName} ${demographics.middleName.charAt(0)}.`;
    document.getElementById('header-mrn').textContent = demographics.mrn;

    if (demographics.dob) {
        const age = calculateAge(demographics.dob);
        const dobFormatted = new Date(demographics.dob).toLocaleDateString();
        document.getElementById('header-dob').textContent = `${dobFormatted} (${age}y)`;
    }

    if (demographics.allergies) {
        const allergyText = demographics.allergies.split('\n')[0].split('(')[0].trim();
        document.getElementById('header-allergies').textContent = allergyText.toUpperCase();
    }

    saveData('demographics', demographics);
    alert('Demographics saved successfully!');
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

// ============================================
// Vital Signs Functions
// ============================================

function recordVitals() {
    const vitals = {
        date: document.getElementById('vital-date').value,
        time: document.getElementById('vital-time').value,
        bpSystolic: document.getElementById('bp-systolic').value,
        bpDiastolic: document.getElementById('bp-diastolic').value,
        heartRate: document.getElementById('heart-rate').value,
        respRate: document.getElementById('resp-rate').value,
        temp: document.getElementById('temp').value,
        tempRoute: document.getElementById('temp-route').value,
        spo2: document.getElementById('spo2').value,
        o2Delivery: document.getElementById('o2-delivery').value,
        painScale: document.getElementById('pain-scale').value,
        painLocation: document.getElementById('pain-location').value,
        timestamp: getCurrentDateTime()
    };

    // Validate required fields
    if (!vitals.bpSystolic || !vitals.bpDiastolic) {
        alert('Please enter blood pressure values');
        return;
    }

    // Load existing vitals history
    let vitalsHistory = loadData('vitalsHistory') || [];
    vitalsHistory.unshift(vitals); // Add to beginning
    saveData('vitalsHistory', vitalsHistory);

    updateVitalsTable();
    clearVitalsForm();
    alert('Vital signs recorded successfully!');
}

function updateVitalsTable() {
    const vitalsHistory = loadData('vitalsHistory') || [];
    const tbody = document.getElementById('vitals-history');

    if (vitalsHistory.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No vital signs recorded yet</td></tr>';
        return;
    }

    tbody.innerHTML = vitalsHistory.map((vital, index) => `
        <tr>
            <td>${vital.date} ${vital.time}</td>
            <td>${vital.bpSystolic}/${vital.bpDiastolic}</td>
            <td>${vital.heartRate || '-'}</td>
            <td>${vital.respRate || '-'}</td>
            <td>${vital.temp ? vital.temp + '°F (' + vital.tempRoute + ')' : '-'}</td>
            <td>${vital.spo2 ? vital.spo2 + '%' : '-'}</td>
            <td>${vital.painScale ? vital.painScale + '/10' : '-'}</td>
            <td><button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;" onclick="deleteVital(${index})">Delete</button></td>
        </tr>
    `).join('');
}

function deleteVital(index) {
    if (confirm('Delete this vital signs entry?')) {
        let vitalsHistory = loadData('vitalsHistory') || [];
        vitalsHistory.splice(index, 1);
        saveData('vitalsHistory', vitalsHistory);
        updateVitalsTable();
    }
}

function clearVitalsForm() {
    const fields = ['bp-systolic', 'bp-diastolic', 'heart-rate', 'resp-rate', 'temp', 'spo2', 'pain-scale', 'pain-location'];
    fields.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = '';
    });
    setCurrentDateTime();
}

// ============================================
// Medication Functions
// ============================================

function showAddMedicationForm() {
    document.getElementById('add-medication-form').style.display = 'block';
}

function hideAddMedicationForm() {
    document.getElementById('add-medication-form').style.display = 'none';
}

function addMedication() {
    const med = {
        name: document.getElementById('med-name').value,
        dose: document.getElementById('med-dose').value,
        route: document.getElementById('med-route').value,
        frequency: document.getElementById('med-frequency').value,
        indication: document.getElementById('med-indication').value,
        startDate: document.getElementById('med-start-date').value,
        status: 'Active',
        lastGiven: null,
        nextDue: null
    };

    if (!med.name || !med.dose || !med.route || !med.frequency) {
        alert('Please fill in all required fields');
        return;
    }

    let medications = loadData('medications') || [];
    medications.push(med);
    saveData('medications', medications);

    updateMedicationTable();
    hideAddMedicationForm();

    // Clear form
    ['med-name', 'med-dose', 'med-route', 'med-frequency', 'med-indication', 'med-start-date'].forEach(id => {
        document.getElementById(id).value = '';
    });

    alert('Medication added to MAR!');
}

function updateMedicationTable() {
    const medications = loadData('medications') || [];
    const tbody = document.getElementById('medication-list');

    if (medications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No medications ordered</td></tr>';
        return;
    }

    tbody.innerHTML = medications.map((med, index) => `
        <tr>
            <td><strong>${med.name}</strong><br><small>${med.indication || ''}</small></td>
            <td>${med.dose}</td>
            <td>${med.route}</td>
            <td>${med.frequency}</td>
            <td>${med.lastGiven || '-'}</td>
            <td>${med.nextDue || 'Calculate'}</td>
            <td><span class="badge badge-success">${med.status}</span></td>
            <td>
                <button class="btn btn-primary" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;" onclick="administerMedication(${index})">Give</button>
                <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;" onclick="deleteMedication(${index})">Remove</button>
            </td>
        </tr>
    `).join('');
}

function administerMedication(index) {
    const medications = loadData('medications') || [];
    const med = medications[index];

    const initials = prompt('Enter your initials:');
    if (!initials) return;

    const site = (med.route === 'IM' || med.route === 'SubQ') ? prompt('Enter injection site:') : '';

    const adminRecord = {
        dateTime: getCurrentDateTime(),
        medication: med.name,
        dose: med.dose,
        route: med.route,
        site: site || 'N/A',
        initials: initials
    };

    // Update medication last given
    medications[index].lastGiven = getCurrentDateTime();
    saveData('medications', medications);

    // Add to administration log
    let adminLog = loadData('adminLog') || [];
    adminLog.unshift(adminRecord);
    saveData('adminLog', adminLog);

    updateMedicationTable();
    updateAdminLog();
    alert('Medication administered and logged!');
}

function deleteMedication(index) {
    if (confirm('Remove this medication from the MAR?')) {
        let medications = loadData('medications') || [];
        medications.splice(index, 1);
        saveData('medications', medications);
        updateMedicationTable();
    }
}

function updateAdminLog() {
    const adminLog = loadData('adminLog') || [];
    const tbody = document.getElementById('admin-log');

    if (adminLog.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No administrations recorded</td></tr>';
        return;
    }

    tbody.innerHTML = adminLog.map(record => `
        <tr>
            <td>${record.dateTime}</td>
            <td>${record.medication}</td>
            <td>${record.dose}</td>
            <td>${record.route}</td>
            <td>${record.site}</td>
            <td><strong>${record.initials}</strong></td>
        </tr>
    `).join('');
}

// ============================================
// Assessment Functions
// ============================================

function saveAssessment() {
    const assessment = {
        date: document.getElementById('assessment-date').value,
        time: document.getElementById('assessment-time').value,
        type: document.getElementById('assessment-type').value,
        timestamp: getCurrentDateTime()
    };

    // Collect all assessment data
    const assessmentFields = document.querySelectorAll('#assessments input, #assessments select, #assessments textarea');
    assessmentFields.forEach(field => {
        if (field.id && field.id !== 'assessment-date' && field.id !== 'assessment-time' && field.id !== 'assessment-type') {
            if (field.type === 'checkbox') {
                assessment[field.id] = field.checked;
            } else {
                assessment[field.id] = field.value;
            }
        }
    });

    saveData('currentAssessment', assessment);
    alert('Assessment saved successfully!');
}

// ============================================
// Care Plan Functions
// ============================================

function showAddCarePlanForm() {
    document.getElementById('add-careplan-form').style.display = 'block';
}

function hideAddCarePlanForm() {
    document.getElementById('add-careplan-form').style.display = 'none';
}

function addCarePlan() {
    let diagnosis = document.getElementById('nursing-diagnosis').value;

    if (diagnosis === 'other') {
        diagnosis = document.getElementById('custom-diagnosis').value;
    }

    const carePlan = {
        diagnosis: diagnosis,
        relatedTo: document.getElementById('related-to').value,
        evidencedBy: document.getElementById('evidenced-by').value,
        shortTermGoal: document.getElementById('short-term-goal').value,
        longTermGoal: document.getElementById('long-term-goal').value,
        interventions: document.getElementById('interventions').value,
        status: 'Active',
        created: getCurrentDateTime()
    };

    if (!carePlan.diagnosis) {
        alert('Please select or enter a nursing diagnosis');
        return;
    }

    let carePlans = loadData('carePlans') || [];
    carePlans.push(carePlan);
    saveData('carePlans', carePlans);

    updateCarePlansDisplay();
    hideAddCarePlanForm();

    // Clear form
    ['nursing-diagnosis', 'custom-diagnosis', 'related-to', 'evidenced-by', 'short-term-goal', 'long-term-goal', 'interventions'].forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = '';
    });

    alert('Care plan added successfully!');
}

function updateCarePlansDisplay() {
    const carePlans = loadData('carePlans') || [];
    const container = document.getElementById('active-careplans');

    if (carePlans.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No care plans created yet</p>';
        return;
    }

    container.innerHTML = carePlans.map((plan, index) => `
        <div class="vitals-entry" style="border-left: 4px solid var(--primary-blue);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">${plan.diagnosis}</h4>
                    <span class="badge badge-success">${plan.status}</span>
                    <span style="font-size: 0.875rem; color: var(--text-secondary); margin-left: 1rem;">Created: ${plan.created}</span>
                </div>
                <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem;" onclick="deleteCarePlan(${index})">Remove</button>
            </div>
            
            <div style="margin-top: 1rem;">
                <p><strong>Related to:</strong> ${plan.relatedTo || 'Not specified'}</p>
                <p><strong>As evidenced by:</strong> ${plan.evidencedBy || 'Not specified'}</p>
            </div>
            
            <div style="margin-top: 1rem; background-color: var(--bg-main); padding: 1rem; border-radius: var(--border-radius);">
                <h5 style="color: var(--text-primary); margin-bottom: 0.5rem;">Short-Term Goal</h5>
                <p>${plan.shortTermGoal || 'Not specified'}</p>
                
                <h5 style="color: var(--text-primary); margin-top: 1rem; margin-bottom: 0.5rem;">Long-Term Goal</h5>
                <p>${plan.longTermGoal || 'Not specified'}</p>
            </div>
            
            <div style="margin-top: 1rem;">
                <h5 style="color: var(--text-primary); margin-bottom: 0.5rem;">Interventions</h5>
                <pre style="white-space: pre-wrap; font-family: var(--font-family); background-color: var(--bg-main); padding: 1rem; border-radius: var(--border-radius);">${plan.interventions || 'Not specified'}</pre>
            </div>
        </div>
    `).join('');
}

function deleteCarePlan(index) {
    if (confirm('Remove this care plan?')) {
        let carePlans = loadData('carePlans') || [];
        carePlans.splice(index, 1);
        saveData('carePlans', carePlans);
        updateCarePlansDisplay();
    }
}

// ============================================
// Communication Functions
// ============================================

function saveSBAR() {
    const sbar = {
        situation: document.getElementById('sbar-situation').value,
        background: document.getElementById('sbar-background').value,
        assessment: document.getElementById('sbar-assessment').value,
        recommendation: document.getElementById('sbar-recommendation').value,
        timestamp: getCurrentDateTime()
    };

    if (!sbar.situation || !sbar.background || !sbar.assessment || !sbar.recommendation) {
        alert('Please complete all SBAR sections');
        return;
    }

    // Add to communication log
    const logEntry = {
        dateTime: getCurrentDateTime(),
        type: 'SBAR',
        recipient: 'Provider',
        summary: sbar.situation.substring(0, 100) + '...'
    };

    let commLog = loadData('communicationLog') || [];
    commLog.unshift(logEntry);
    saveData('communicationLog', commLog);

    saveData('lastSBAR', sbar);
    updateCommunicationLog();

    alert('SBAR report saved and logged!');
}

function clearSBAR() {
    ['sbar-situation', 'sbar-background', 'sbar-assessment', 'sbar-recommendation'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function saveShiftReport() {
    const report = {
        date: document.getElementById('shift-date').value,
        shift: document.getElementById('shift-type').value,
        oncomingNurse: document.getElementById('oncoming-nurse').value,
        notes: document.getElementById('shift-notes').value,
        timestamp: getCurrentDateTime()
    };

    if (!report.notes) {
        alert('Please enter shift report notes');
        return;
    }

    // Add to communication log
    const logEntry = {
        dateTime: getCurrentDateTime(),
        type: 'Shift Report',
        recipient: report.oncomingNurse || 'Oncoming Nurse',
        summary: report.notes.substring(0, 100) + '...'
    };

    let commLog = loadData('communicationLog') || [];
    commLog.unshift(logEntry);
    saveData('communicationLog', commLog);

    saveData('lastShiftReport', report);
    updateCommunicationLog();

    alert('Shift report saved and logged!');
}

function clearShiftReport() {
    ['shift-notes', 'oncoming-nurse'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function updateCommunicationLog() {
    const commLog = loadData('communicationLog') || [];
    const tbody = document.getElementById('communication-log');

    if (commLog.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No communications logged</td></tr>';
        return;
    }

    tbody.innerHTML = commLog.map((entry, index) => `
        <tr>
            <td>${entry.dateTime}</td>
            <td><span class="badge badge-info">${entry.type}</span></td>
            <td>${entry.recipient}</td>
            <td>${entry.summary}</td>
            <td><button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;" onclick="deleteCommLog(${index})">Delete</button></td>
        </tr>
    `).join('');
}

function deleteCommLog(index) {
    if (confirm('Delete this communication log entry?')) {
        let commLog = loadData('communicationLog') || [];
        commLog.splice(index, 1);
        saveData('communicationLog', commLog);
        updateCommunicationLog();
    }
}

// ============================================
// Load All Data on Page Load
// ============================================

function loadAllData() {
    updateVitalsTable();
    updateMedicationTable();
    updateAdminLog();
    updateCarePlansDisplay();
    updateCommunicationLog();
}
