// patientDashboard.js

import { createDoctorCard } from "./components/doctorCard.js";
import { openModal } from "./components/modals.js";
import { getDoctors, filterDoctors } from "./services/doctorServices.js";
import { patientLogin, patientSignup } from "./services/patientServices.js";

/* ===============================
   DOM READY
================================= */
document.addEventListener("DOMContentLoaded", () => {

  // Load doctors on page load
  loadDoctorCards();

  // Signup button
  const signupBtn = document.getElementById("patientSignup");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => openModal("patientSignup"));
  }

  // Login button
  const loginBtn = document.getElementById("patientLogin");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => openModal("patientLogin"));
  }

  // Search & Filters
  const searchBar = document.getElementById("searchBar");
  const filterTime = document.getElementById("filterTime");
  const filterSpecialty = document.getElementById("filterSpecialty");

  if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
  if (filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);
  if (filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);
});


/* ===============================
   LOAD ALL DOCTORS
================================= */
async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to load doctors:", error);
    document.getElementById("content").innerHTML =
      "<p>❌ Failed to load doctors.</p>";
  }
}


/* ===============================
   FILTER DOCTORS
================================= */
async function filterDoctorsOnChange() {
  try {
    const name = document.getElementById("searchBar")?.value.trim() || null;
    const time = document.getElementById("filterTime")?.value || null;
    const specialty = document.getElementById("filterSpecialty")?.value || null;

    const response = await filterDoctors(name, time, specialty);
    const doctors = response?.doctors || [];

    renderDoctorCards(doctors);

  } catch (error) {
    console.error("Filtering error:", error);
    document.getElementById("content").innerHTML =
      "<p>❌ Error while filtering doctors.</p>";
  }
}


/* ===============================
   RENDER DOCTOR CARDS
================================= */
function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML =
      "<p>No doctors found with the given filters.</p>";
    return;
  }

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}


/* ===============================
   PATIENT SIGNUP
================================= */
window.signupPatient = async function () {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const data = { name, email, password, phone, address };

    const { success, message } = await patientSignup(data);

    if (success) {
      alert(message);
      document.getElementById("modal").classList.add("hidden");
      window.location.reload();
    } else {
      alert(message);
    }

  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ An error occurred while signing up.");
  }
};


/* ===============================
   PATIENT LOGIN
================================= */
window.loginPatient = async function () {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await patientLogin({ email, password });

    if (response.ok) {
      const result = await response.json();

      localStorage.setItem("token", result.token);
      selectRole("loggedPatient");

      window.location.href = "/pages/loggedPatientDashboard.html";
    } else {
      alert("❌ Invalid credentials!");
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("❌ Failed to login. Try again.");
  }
};
