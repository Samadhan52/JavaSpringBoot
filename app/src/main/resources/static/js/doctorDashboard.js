// ======================================================
// Doctor Dashboard - View Appointments
// ======================================================

// Import required modules
import { getAllAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRows.js";


// ======================================================
// Global Variables
// ======================================================

// Table body where patient rows will be rendered
const patientTableBody = document.getElementById("patientTableBody");

// Initialize today's date (YYYY-MM-DD)
let selectedDate = new Date().toISOString().split("T")[0];

// Retrieve doctor authentication token
const token = localStorage.getItem("token");

// Patient name filter
let patientName = null;


// ======================================================
// Search Bar Functionality
// ======================================================

const searchBar = document.getElementById("searchBar");

searchBar?.addEventListener("input", () => {
  const value = searchBar.value.trim();
  patientName = value !== "" ? value : "null";
  loadAppointments();
});


// ======================================================
// Today's Appointments Button
// ======================================================

const todayButton = document.getElementById("todayButton");
const datePicker = document.getElementById("datePicker");

todayButton?.addEventListener("click", () => {
  selectedDate = new Date().toISOString().split("T")[0];

  if (datePicker) {
    datePicker.value = selectedDate;
  }

  loadAppointments();
});


// ======================================================
// Date Picker Change Event
// ======================================================

datePicker?.addEventListener("change", (e) => {
  selectedDate = e.target.value;
  loadAppointments();
});


// ======================================================
// Function: loadAppointments
// Fetch and Render Appointments
// ======================================================

async function loadAppointments() {
  try {
    if (!token) {
      patientTableBody.innerHTML = `
        <tr>
          <td colspan="5">Unauthorized. Please login again.</td>
        </tr>
      `;
      return;
    }

    // Fetch appointments from backend
    const appointments = await getAllAppointments(
      selectedDate,
      patientName || "null",
      token
    );

    // Clear existing table rows
    patientTableBody.innerHTML = "";

    // If no appointments found
    if (!appointments || appointments.length === 0) {
      patientTableBody.innerHTML = `
        <tr>
          <td colspan="5">No Appointments found for today.</td>
        </tr>
      `;
      return;
    }

    // Render each appointment
    appointments.forEach((appointment) => {

      const patient = {
        id: appointment.patient?.id,
        name: appointment.patient?.name,
        email: appointment.patient?.email,
        mobile: appointment.patient?.mobile
      };

      const row = createPatientRow(patient, appointment);
      patientTableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading appointments:", error);

    patientTableBody.innerHTML = `
      <tr>
        <td colspan="5">Error loading appointments. Try again later.</td>
      </tr>
    `;
  }
}


// ======================================================
// Initial Render on Page Load
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

  // Set date picker default value
  if (datePicker) {
    datePicker.value = selectedDate;
  }

  // Optional: if your layout uses renderContent()
  if (typeof renderContent === "function") {
    renderContent();
  }

  // Load today's appointments
  loadAppointments();
});
