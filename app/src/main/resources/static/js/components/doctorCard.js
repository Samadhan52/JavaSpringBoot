// doctorCard.js

import { deleteDoctor } from "../services/doctorServices.js";
import { getPatientData } from "../services/patientServices.js";
import { showBookingOverlay } from "../loggedPatient.js"; // adjust path if needed

export function createDoctorCard(doctor) {

  // Main Card Container
  const card = document.createElement("div");
  card.classList.add("doctor-card");

  // Get current role
  const role = localStorage.getItem("userRole");

  // Doctor Info Section
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("doctor-info");

  const name = document.createElement("h3");
  name.textContent = doctor.name;

  const specialization = document.createElement("p");
  specialization.textContent = `Specialty: ${doctor.specialty || doctor.specialization || "N/A"}`;

  const email = document.createElement("p");
  email.textContent = `Email: ${doctor.email}`;

  const availability = document.createElement("p");
  availability.textContent = `Available: ${(doctor.availableTimes || doctor.availability)?.join(", ") || "N/A"}`;

  infoDiv.appendChild(name);
  infoDiv.appendChild(specialization);
  infoDiv.appendChild(email);
  infoDiv.appendChild(availability);

  // Action Buttons Container
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("card-actions");

  // =========================
  // ADMIN ROLE
  // =========================
  if (role === "admin") {

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete";

    removeBtn.addEventListener("click", async () => {
      const confirmDelete = confirm("Are you sure you want to delete this doctor?");
      if (!confirmDelete) return;

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired.");
        return;
      }

      try {
        const response = await deleteDoctor(doctor.id, token);

        if (response.success) {
          alert("Doctor deleted successfully.");
          card.remove(); // remove from DOM
        } else {
          alert("Failed to delete doctor.");
        }

      } catch (error) {
        console.error("Delete error:", error);
        alert("Error deleting doctor.");
      }
    });

    actionsDiv.appendChild(removeBtn);
  }

  // =========================
  // PATIENT (NOT LOGGED IN)
  // =========================
  else if (role === "patient") {

    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";

    bookNow.addEventListener("click", () => {
      alert("Patient needs to login first.");
    });

    actionsDiv.appendChild(bookNow);
  }

  // =========================
  // LOGGED-IN PATIENT
  // =========================
  else if (role === "loggedPatient") {

    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";

    bookNow.addEventListener("click", async (e) => {

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = "/";
        return;
      }

      try {
        const patientData = await getPatientData(token);
        showBookingOverlay(e, doctor, patientData);

      } catch (error) {
        console.error("Booking error:", error);
        alert("Unable to proceed with booking.");
      }
    });

    actionsDiv.appendChild(bookNow);
  }

  // Final Assembly
  card.appendChild(infoDiv);
  card.appendChild(actionsDiv);

  return card;
}
