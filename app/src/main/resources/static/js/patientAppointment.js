// patientAppointment.js
import { getPatientAppointments, getPatientData, filterAppointments } from "./services/patientServices.js";

const tableBody = document.getElementById("patientTableBody");
const token = localStorage.getItem("token");

let allAppointments = [];
let filteredAppointments = [];
let patientId = null;

document.addEventListener("DOMContentLoaded", initializePage);

async function initializePage() {
  try {
    if (!token) throw new Error("No token found");

    const patient = await getPatientData(token);
    if (!patient) throw new Error("Failed to fetch patient details");

    patientId = Number(patient.id);

    const appointmentData = await getPatientAppointments(patientId, token) || [];

    // Store all appointments
    allAppointments = appointmentData.filter(app => app.patientId === patientId);

    renderAppointments(allAppointments);

  } catch (error) {
    console.error("Error loading appointments:", error);
    alert("❌ Failed to load your appointments.");
  }
}

function renderAppointments(appointments) {
  tableBody.innerHTML = "";

  if (!appointments || appointments.length === 0) {
    tableBody.innerHTML =
      `<tr><td colspan="5" style="text-align:center;">No Appointments Found</td></tr>`;
    return;
  }

  appointments.forEach(appointment => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${appointment.patientName || "You"}</td>
      <td>${appointment.doctorName}</td>
      <td>${appointment.appointmentDate}</td>
      <td>${appointment.appointmentTimeOnly}</td>
      <td>
        ${
          appointment.status == 0
            ? `<img src="../assets/images/edit/edit.png"
                 alt="Edit"
                 class="edit-btn"
                 style="cursor:pointer;">`
            : "-"
        }
      </td>
    `;

    if (appointment.status == 0) {
      tr.querySelector(".edit-btn")
        ?.addEventListener("click", () => redirectToUpdatePage(appointment));
    }

    tableBody.appendChild(tr);
  });
}

function redirectToUpdatePage(appointment) {
  const queryString = new URLSearchParams({
    appointmentId: appointment.id,
    patientId: appointment.patientId,
    patientName: appointment.patientName || "You",
    doctorName: appointment.doctorName,
    doctorId: appointment.doctorId,
    appointmentDate: appointment.appointmentDate,
    appointmentTime: appointment.appointmentTimeOnly,
  }).toString();

  window.location.href = `/pages/updateAppointment.html?${queryString}`;
}


/* ============================================================
   SEARCH + FILTER
============================================================ */

document.getElementById("searchBar")
  ?.addEventListener("input", handleFilterChange);

document.getElementById("appointmentFilter")
  ?.addEventListener("change", handleFilterChange);

async function handleFilterChange() {
  const searchBarValue = document.getElementById("searchBar").value.trim();
  const filterValue = document.getElementById("appointmentFilter").value;

  // Convert UI values properly
  const name = searchBarValue ? searchBarValue : null;
  const condition =
    filterValue === "allAppointments" ? null : filterValue;

  try {
    // If BOTH empty → show all immediately (no API call)
    if (!condition && !name) {
      renderAppointments(allAppointments);
      return;
    }

    const appointments = await filterAppointments(condition, name, token);

    if (!appointments || appointments.length === 0) {
      renderAppointments([]);
      return;
    }

    filteredAppointments =
      appointments.filter(app => app.patientId === patientId);

    renderAppointments(filteredAppointments);

  } catch (error) {
    console.error("Failed to filter appointments:", error);

    // fallback to all appointments
    renderAppointments(allAppointments);
  }
}
