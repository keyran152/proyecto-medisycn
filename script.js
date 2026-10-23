// Script de Control Telemétrico MediSync
var simulatedBPM = 74;
var activeOTP = "";
var keypadBuffer = "";
var currentWeight = 68;
var USER_EMAIL = "morakeyran89@gmail.com";

// Base de datos de 30 Medicamentos principales
var medicationsList = [
    { name: "Paracetamol (Acetaminofén)", use: "Dolor de cabeza leve a moderado, fiebre y malestar general." },
    { name: "Ibuprofeno", use: "Dolor de cabeza, inflamación, fiebre y dolores musculares o articulares." },
    { name: "Ácido Acetilsalicílico (Aspirina)", use: "Dolor de cabeza, fiebre y prevención cardiovascular (antiagregante)." },
    { name: "Naproxeno", use: "Migrañas, dolores musculares intensos e inflamación articular." },
    { name: "Omeprazol", use: "Acidez estomacal, reflujo gastroesofágico y gastritis." },
    { name: "Ranitidina", use: "Alivio de la acidez estomacal e indigestión ácida." },
    { name: "Antiácidos (Hidróxido de Aluminio/Magnesio)", use: "Malestar estomacal rápido por exceso de acidez." },
    { name: "Loperamida", use: "Control y tratamiento sintomático de la diarrea aguda." },
    { name: "Simeticona", use: "Alivio de gases, hinchazón y distensión abdominal." },
    { name: "Metoclopramida", use: "Control de náuseas, vómitos y malestar estomacal severo." },
    { name: "Loratadina", use: "Alergias estacionales, rinitis alérgica y picazón en la piel." },
    { name: "Cetirizina", use: "Tratamiento de alergias, estornudos y urticaria." },
    { name: "Clorfenamina", use: "Alergias, síntomas de resfriado común y picazón." },
    { name: "Dextrometorfano", use: "Supresión de la tos seca e irritativa." },
    { name: "Ambroxol", use: "Expectorante para facilitar la salida de flemas y congestión." },
    { name: "Salbutamol", use: "Broncodilatador para crisis de asma y dificultad respiratoria." },
    { name: "Losartán Potásico", use: "Control de la presión arterial alta (Hipertensión) y protección renal." },
    { name: "Enalapril", use: "Reducción de la presión arterial e insuficiencia cardíaca." },
    { name: "Amlodipina", use: "Tratamiento de la hipertensión arterial y angina de pecho." },
    { name: "Metformina", use: "Control de niveles de glucosa en sangre (Diabetes tipo 2)." },
    { name: "Atorvastatina", use: "Reducción de colesterol alto y triglicéridos en sangre." },
    { name: "Diclofenaco sódico/potásico", use: "Dolor e inflamación severa en articulaciones y músculos." },
    { name: "Ketorolaco", use: "Dolor agudo de moderado a severo (uso a corto plazo)." },
    { name: "Tramadol", use: "Dolor moderado a severo resistente a analgésicos comunes." },
    { name: "Butilhioscina (Buscapina)", use: "Cólicos estomacales, intestinales y dolor abdominal espasmódico." },
    { name: "Hidrocortisona Crema", use: "Irritaciones cutáneas leves, inflamación de piel y picazón local." },
    { name: "Neomicina / Bacitracina", use: "Prevención de infecciones en cortes, raspones y heridas leves." },
    { name: "Sales de Rehidratación Oral (Electrolitos)", use: "Prevención y tratamiento de la deshidratación por diarrea o vómito." },
    { name: "Melatonina", use: "Regulación del ciclo del sueño y tratamiento de insomnio ocasional." },
    { name: "Vitamina C / Complejo Multivitamínico", use: "Apoyo al sistema inmunológico y suplemento nutricional diario." }
];

// Base de datos de 20 Miembros del Personal Médico
var staffList = [
    { id: "PM-101", name: "Dr. Gabriel Cordonero", area: "Cardiología & Telemetría", shift: "Turno Mañana (06:00 - 14:00)" },
    { id: "PM-102", name: "Dra. Elena Vargas M.", area: "Medicina Interna", shift: "Turno Mañana (06:00 - 14:00)" },
    { id: "PM-103", name: "Dr. Carlos Solano H.", area: "Urgencias & Emergencias", shift: "Turno Tarde (14:00 - 22:00)" },
    { id: "PM-104", name: "Licda. Mariam Castro R.", area: "Jefatura de Enfermería", shift: "Turno Mañana (06:00 - 14:00)" },
    { id: "PM-105", name: "Dr. Andrés Morales B.", area: "Neurología Clínica", shift: "Turno Tarde (14:00 - 22:00)" },
    { id: "PM-106", name: "Dra. Lucía Fernández P.", area: "Pediatría", shift: "Turno Mañana (06:00 - 14:00)" },
    { id: "PM-107", name: "Dr. Roberto Brenes K.", area: "Traumatología", shift: "Turno Noche (22:00 - 06:00)" },
    { id: "PM-108", name: "Enf. Valeria Rojas A.", area: "Cuidados Intensivos (UCI)", shift: "Turno Noche (22:00 - 06:00)" },
    { id: "PM-109", name: "Dr. Esteban Quirós T.", area: "Gastroenterología", shift: "Turno Tarde (14:00 - 22:00)" },
    { id: "PM-110", name: "Dra. Sofía Monge L.", area: "Dermatología", shift: "Turno Mañana (06:00 - 14:00)" },
    { id: "PM-111", name: "Dr. Javier Campos V.", area: "Anestesiología", shift: "Turno Rotativo / Quirófano" },
    { id: "PM-112", name: "Enf. Diego Navarro G.", area: "Monitoreo Telemétrico", shift: "Turno Tarde (14:00 - 22:00)" },
    { id: "PM-113", name: "Dra. Paula Araya S.", area: "Endocrinología & Diabetes", shift: "Turno Mañana (06:00 - 14:00)" },
    { id: "PM-114", name: "Dr. Mauricio Valverde H.", area: "Neumología", shift: "Turno Tarde (14:00 - 22:00)" },
    { id: "PM-115", name: "Licda. Raquel Soto M.", area: "Farmacia Hospitalaria", shift: "Turno Mañana (06:00 - 14:00)" },
    { id: "PM-116", name: "Dr. Fernando Mora Z.", area: "Cirugía General", shift: "Turno Noche (22:00 - 06:00)" },
    { id: "PM-117", name: "Dra. Natalia Jiménez K.", area: "Ginecología & Obstetricia", shift: "Turno Tarde (14:00 - 22:00)" },
    { id: "PM-118", name: "Enf. Kevin Marín R.", area: "Soporte Telemétrico & 2FA", shift: "Turno Mañana (06:00 - 14:00)" },
    { id: "PM-119", name: "Dr. Adrián Delgado P.", area: "Nefrología", shift: "Turno Tarde (14:00 - 22:00)" },
    { id: "PM-120", name: "Dra. Mónica Castillo F.", area: "Nutrición Clínica", shift: "Turno Mañana (06:00 - 14:00)" }
];

// Cargar tablas dinámicas al iniciar
window.onload = function() {
    // Cargar 30 Medicamentos
    var medTbody = document.getElementById('medsTableBody');
    if (medTbody) {
        var htmlMeds = "";
        for (var i = 0; i < medicationsList.length; i++) {
            htmlMeds += "<tr>" +
                "<td><strong>" + (i + 1) + "</strong></td>" +
                "<td>" + medicationsList[i].name + "</td>" +
                "<td>" + medicationsList[i].use + "</td>" +
                "</tr>";
        }
        medTbody.innerHTML = htmlMeds;
    }

    // Cargar 20 Funcionarios
    var staffTbody = document.getElementById('staffTableBody');
    if (staffTbody) {
        var htmlStaff = "";
        for (var j = 0; j < staffList.length; j++) {
            htmlStaff += "<tr>" +
                "<td><strong>" + staffList[j].id + "</strong></td>" +
                "<td>" + staffList[j].name + "</td>" +
                "<td>" + staffList[j].area + "</td>" +
                "<td><span style='color: var(--primary-blue); font-weight: 600;'>" + staffList[j].shift + "</span></td>" +
                "</tr>";
        }
        staffTbody.innerHTML = htmlStaff;
    }
};

// Acceso Restringido y Validación de Personal Médico (Clave 1234567)
function openAuthModal() {
    document.getElementById('authLoginForm').style.display = 'block';
    document.getElementById('staffListContainer').style.display = 'none';
    document.getElementById('staffPassInput').value = "";
    document.getElementById('authStatus').innerText = "";
    document.getElementById('modalAuth').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('modalAuth').style.display = 'none';
}

function validateStaffAuth() {
    var pass = document.getElementById('staffPassInput').value;
    var authStatus = document.getElementById('authStatus');

    if (pass === "1234567") {
        authStatus.style.color = '#27ae60';
        authStatus.innerText = "✅ Clave correcta. Accediendo a nómina...";
        setTimeout(function() {
            document.getElementById('authLoginForm').style.display = 'none';
            document.getElementById('staffListContainer').style.display = 'block';
            showToast("Nómina y Turnos de Personal Desbloqueados");
        }, 1000);
    } else {
        authStatus.style.color = '#e74c3c';
        authStatus.innerText = "❌ Clave incorrecta (Use: 1234567).";
    }
}

// Actualizar Peso dentro de la Frecuencia Cardíaca
function updateWeight() {
    var weightInput = document.getElementById('inputWeight');
    if (weightInput && weightInput.value) {
        currentWeight = parseFloat(weightInput.value);
        showToast("Peso ajustado a " + currentWeight + " kg. Telemetría calibrada.");
    }
}

// Simulación telemétrica en tiempo real
setInterval(function() {
    var variation = Math.floor(Math.random() * 5) - 2; 
    var weightFactor = Math.floor(currentWeight / 30);
    simulatedBPM = Math.min(Math.max((72 + weightFactor) + variation, 60), 98);

    var bpmElem = document.getElementById('bpmVal');
    if (bpmElem) bpmElem.innerText = simulatedBPM;

    var sysElem = document.getElementById('sysVal');
    var diaElem = document.getElementById('diaVal');
    if (sysElem && diaElem) {
        sysElem.innerText = (115 + weightFactor) + Math.floor(Math.random() * 4);
        diaElem.innerText = 75 + Math.floor(Math.random() * 3);
    }
}, 2500);

// Módulos Interactivos
function openAppointmentModal() { document.getElementById('modalAppointment').style.display = 'flex'; }
function closeAppointmentModal() { document.getElementById('modalAppointment').style.display = 'none'; }

function submitAppointment() {
    var specialty = document.getElementById('apptSpecialty').value;
    var date = document.getElementById('apptDate').value;
    var time = document.getElementById('apptTime').value;
    var status = document.getElementById('apptStatus');
    
    if (!date || !time) {
        status.style.color = '#e74c3c';
        status.innerText = "❌ Seleccione fecha y hora.";
        return;
    }
    status.style.color = '#27ae60';
    status.innerText = "✅ Cita agendada con éxito.";
    setTimeout(function() {
        closeAppointmentModal();
        showToast("Cita reservada en " + specialty + " (" + date + " a las " + time + ")");
        status.innerText = "";
    }, 1200);
}

function openHistoryModal() { document.getElementById('modalHistory').style.display = 'flex'; }
function closeHistoryModal() { document.getElementById('modalHistory').style.display = 'none'; }

function openMedModal() { document.getElementById('modalMeds').style.display = 'flex'; }
function closeMedModal() { document.getElementById('modalMeds').style.display = 'none'; }

function init2FAVerification() {
    activeOTP = Math.floor(100000 + Math.random() * 900000).toString();
    document.getElementById('generatedOTPCode').innerText = activeOTP;
    document.getElementById('modal2FA').style.display = 'flex';
}
function close2FAModal() { document.getElementById('modal2FA').style.display = 'none'; }

function verifyOTP() {
    var userInput = document.getElementById('otpInput').value;
    var statusMsg = document.getElementById('otpStatus');

    if (userInput === activeOTP) {
        statusMsg.style.color = '#27ae60';
        statusMsg.innerText = "✅ Código verificado correctamente.";
        setTimeout(function() {
            close2FAModal();
            showToast("Verificación 2FA notificada a " + USER_EMAIL);
        }, 1200);
    } else {
        statusMsg.style.color = '#e74c3c';
        statusMsg.innerText = "❌ Código OTP incorrecto.";
    }
}

// Teclado Numérico Digital
function pressNum(num) {
    if (keypadBuffer.length < 3) {
        keypadBuffer += num;
        document.getElementById('keypadDisplay').innerText = keypadBuffer;
    }
}

function clearKeypad() {
    keypadBuffer = "";
    document.getElementById('keypadDisplay').innerText = "--";
}

function submitPulse() {
    if (!keypadBuffer) return;
    simulatedBPM = parseInt(keypadBuffer, 10);
    document.getElementById('bpmVal').innerText = simulatedBPM;
    showToast("Pulso registrado: " + simulatedBPM + " BPM (" + currentWeight + " kg)");
    keypadBuffer = "";
    document.getElementById('keypadDisplay').innerText = "--";
}

function showToast(msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.style.display = 'block';
    setTimeout(function() { toast.style.display = 'none'; }, 3000);
}