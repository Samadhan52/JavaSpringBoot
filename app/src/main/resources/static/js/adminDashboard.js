// ======================================================
// Admin Dashboard - Manage Doctors
// ======================================================

// Import required modules
import { openModal, closeModal } from "./components/modals.js";
import { getDoctors, filterDoctors, saveDoctor } from "./services/doctorServices.js";
import { createDoctorCard } from "./components/doctorCard.js";


// ======================================================
// Event Binding
// ======================================================

// Add Doctor button → open modal
document.getElementById("addDocBtn")?.addEventListener("click", () => {
  openModal("addDoctor");
});


// ======================================================
// Load Doctors on Page Load
// ======================================================

window.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();

  // Search + Filter Event Listeners
  document.getElementById("searchBar")?.addEventListener("input", filterDoctorsOnChange);
  document.getElementById("sortTime")?.addEventListener("change", filterDoctorsOnChange);
  document.getElementById("specialtyFilter")?.addEventListener("change", filterDoctorsOnChange);
});


// ======================================================
// Function: loadDoctorCards
// Fetch & render all doctors
// ======================================================

async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Error loading doctors:", error);
  }
}


// ======================================================
// Function: renderDoctorCards
// Render a list of doctors
// ======================================================

function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  if (!contentDiv) {
    return;
  }

  contentDiv.innerHTML = "";

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = "<p>No doctors found.</p>";
    return;
  }

  doctors.forEach((doctor) => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}


// ======================================================
// Function: filterDoctorsOnChange
// Filter doctors based on search & dropdowns
// ======================================================

async function filterDoctorsOnChange() {
  try {
    const name = document.getElementById("searchBar")?.value.trim() || null;
    const time = document.getElementById("sortTime")?.value || null;
    const specialty = document.getElementById("specialtyFilter")?.value || null;

    const doctors = await filterDoctors(name, time, specialty);
    renderDoctorCards(doctors);

  } catch (error) {
    console.error("Filter error:", error);
    alert("Something went wrong while filtering doctors.");
  }
}


// ======================================================
// Function: adminAddDoctor
// Handle Add Doctor Form Submission
// ======================================================

window.adminAddDoctor = async function () {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized! Please login again.");
      return;
    }

    // Collect form values
    const name = document.getElementById("doctorName")?.value.trim();
    const email = document.getElementById("doctorEmail")?.value.trim();
    const password = document.getElementById("doctorPassword")?.value.trim();
    const mobile = document.getElementById("doctorPhone")?.value.trim();
    const specialty = document.getElementById("specialization")?.value;

    // Collect availability (checkboxes)
    const availabilityCheckboxes = document.querySelectorAll(
      'input[name="availability"]:checked'
    );

    const availability = Array.from(availabilityCheckboxes).map(
      (checkbox) => checkbox.value
    );

    // Build doctor object
    const doctor = {
      name,
      email,
      password,
      mobile,
      specialty,
      availability
    };

    // Save doctor via service
    const response = await saveDoctor(doctor, token);

    if (response.success) {
      alert("Doctor added successfully!");
      closeModal();
      loadDoctorCards(); // Refresh doctor list
    } else {
      alert(response.message || "Failed to add doctor.");
    }

  } catch (error) {
    console.error("Error adding doctor:", error);
    alert("Something went wrong while adding doctor.");
  }
};
