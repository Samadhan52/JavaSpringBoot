// header.js

function renderHeader() {
  const headerDiv = document.getElementById("header");
  if (!headerDiv) return;

  // 1️⃣ If user is on homepage → clear session
  if (window.location.pathname.endsWith("/")) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");

    headerDiv.innerHTML = `
      <header class="header">
        <div class="logo-section">
          <img src="./assets/images/logo/logo.png" 
               alt="Hospital CMS Logo" 
               class="logo-img">
          <span class="logo-title">Hospital CMS</span>
        </div>
      </header>
    `;
    return;
  }

  // 2️⃣ Get role & token
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  // 3️⃣ Handle invalid session
  if (
    (role === "loggedPatient" || role === "admin" || role === "doctor") &&
    !token
  ) {
    localStorage.removeItem("userRole");
    alert("Session expired or invalid login. Please log in again.");
    window.location.href = "/";
    return;
  }

  // 4️⃣ Start building header
  let headerContent = `
    <header class="header">
      <div class="logo-section">
        <img src="../assets/images/logo/logo.png" 
             alt="Hospital CMS Logo" 
             class="logo-img">
        <span class="logo-title">Hospital CMS</span>
      </div>
      <nav>
  `;

  // 5️⃣ Role-based rendering

  // 🔴 ADMIN
  if (role === "admin") {
    headerContent += `
      <button id="addDocBtn" class="adminBtn">Add Doctor</button>
      <a href="#" id="logoutBtn">Logout</a>
    `;
  }

  // 🔵 DOCTOR
  else if (role === "doctor") {
    headerContent += `
      <button id="doctorHome" class="adminBtn">Home</button>
      <a href="#" id="logoutBtn">Logout</a>
    `;
  }

  // 🟢 PATIENT (not logged in)
  else if (role === "patient") {
    headerContent += `
      <button id="patientLogin" class="adminBtn">Login</button>
      <button id="patientSignup" class="adminBtn">Sign Up</button>
    `;
  }

  // 🟣 LOGGED PATIENT
  else if (role === "loggedPatient") {
    headerContent += `
      <button id="homeBtn" class="adminBtn">Home</button>
      <button id="appointmentsBtn" class="adminBtn">Appointments</button>
      <a href="#" id="logoutPatientBtn">Logout</a>
    `;
  }

  headerContent += `
      </nav>
    </header>
  `;

  // 6️⃣ Inject header
  headerDiv.innerHTML = headerContent;

  // 7️⃣ Attach listeners
  attachHeaderButtonListeners();
}

/* ===============================
   Attach Event Listeners
================================= */

function attachHeaderButtonListeners() {
  const addDocBtn = document.getElementById("addDocBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutPatientBtn = document.getElementById("logoutPatientBtn");
  const doctorHome = document.getElementById("doctorHome");
  const homeBtn = document.getElementById("homeBtn");
  const appointmentsBtn = document.getElementById("appointmentsBtn");

  // Admin - Add Doctor
  if (addDocBtn) {
    addDocBtn.addEventListener("click", () => {
      if (typeof openModal === "function") {
        openModal("addDoctor");
      }
    });
  }

  // Generic Logout (Admin / Doctor)
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Patient Logout
  if (logoutPatientBtn) {
    logoutPatientBtn.addEventListener("click", logoutPatient);
  }

  // Doctor Home
  if (doctorHome) {
    doctorHome.addEventListener("click", () => {
      window.location.href = "/doctor/doctorDashboard";
    });
  }

  // Logged Patient Home
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "/pages/loggedPatientDashboard.html";
    });
  }

  // Logged Patient Appointments
  if (appointmentsBtn) {
    appointmentsBtn.addEventListener("click", () => {
      window.location.href = "/pages/patientAppointments.html";
    });
  }
}

/* ===============================
   Logout Functions
================================= */

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "/";
}

function logoutPatient() {
  localStorage.removeItem("token");

  // keep patient role so login/signup show again
  localStorage.setItem("userRole", "patient");

  window.location.href = "/pages/patientDashboard.html";
}

// Render header immediately
renderHeader();
