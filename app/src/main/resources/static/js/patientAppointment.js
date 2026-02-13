// patientAppointment.js
import { getPatientAppointments, getPatientData} from "./services/patientServices.js";

const tableBody = document.getElementById("patientTableBody");
const token = localStorage.getItem("token");

let allAppointments = [];
let currentFilterValue = "future";
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

    await handleFilterChange();

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
const isUpcomingAppointment = isUpcoming(appointment);
    const isEditable =
      currentFilterValue === "future" &&
      appointment.status == 0 &&
      isUpcomingAppointment;
    tr.innerHTML = `
      <td>${appointment.patientName || "You"}</td>
      <td>${appointment.doctorName}</td>
      <td>${appointment.appointmentDate}</td>
      <td>${appointment.appointmentTimeOnly}</td>
      <td>
        ${
           isEditable
            ? `<img src="../assets/images/edit/edit.png"
                 alt="Edit"
                 class="edit-btn"
                 style="cursor:pointer;">`
            : "-"
        }
      </td>
    `;

    if (isEditable) {
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
  currentFilterValue = document.getElementById("appointmentFilter").value;

  let appointmentsToRender = [...allAppointments];

  if (currentFilterValue === "future") {
    appointmentsToRender = appointmentsToRender.filter(isUpcoming);
  } else if (currentFilterValue === "past") {
    appointmentsToRender = appointmentsToRender.filter(app => !isUpcoming(app));
  }
    if (searchBarValue) {
    const query = searchBarValue.toLowerCase();
    appointmentsToRender = appointmentsToRender.filter(app =>
      `${app.patientName || "You"}`.toLowerCase().includes(query) ||
      `${app.doctorName || ""}`.toLowerCase().includes(query)
    );
  }

    try {
    renderAppointments(appointmentsToRender);

  } catch (error) {
    console.error("Failed to filter appointments:", error);

    // fallback to all appointments
    renderAppointments(allAppointments);
  }
}

function isUpcoming(appointment) {
  const appointmentDateTime = new Date(
    `${appointment.appointmentDate}T${appointment.appointmentTimeOnly}`
  );

  return appointmentDateTime.getTime() > Date.now();
}
