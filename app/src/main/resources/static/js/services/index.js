// ==============================
// Imports
// ==============================

import { openModal } from "../components/modals.js";
import { API_BASE_URL } from "../config/config.js";
//import { selectRole } from "../render.js";

// ==============================
// API Endpoints
// ==============================

const ADMIN_API = API_BASE_URL + "/admin/login";
const DOCTOR_API = API_BASE_URL + "/doctor/login";

async function postWithApiFallback(url, payload) {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };

  let response = await fetch(url, request);

  // Some deployments expose backend routes under `/api/*`.
  if (response.status === 404 && API_BASE_URL === "" && !url.startsWith("/api/")) {
    response = await fetch(`/api${url}`, request);
  }

  return response;
}

// ==============================
// Setup Button Event Listeners
// ==============================

window.onload = function () {

  const adminBtn = document.getElementById("adminBtn");
  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      openModal("adminLogin");
    });
  }

  const doctorBtn = document.getElementById("doctorBtn");
  if (doctorBtn) {
    doctorBtn.addEventListener("click", () => {
      openModal("doctorLogin");
    });
  }

  const patientBtn = document.getElementById("patientBtn");
  if (patientBtn) {
    patientBtn.addEventListener("click", () => {
      window.selectRole("patient");
    });
  }

};

// ==============================
// Admin Login Handler
// ==============================

window.adminLoginHandler = async function () {

  const username = document.getElementById("username")?.value;
  const password = document.getElementById("password")?.value;

  const admin = { username, password };

  try {

    const response = await postWithApiFallback(ADMIN_API, admin);

    if (response.ok) {
      const data = await response.json();

      localStorage.setItem("token", data.token);
      window.selectRole("admin");

    } else {
      alert("Invalid credentials!");
    }

  } catch (error) {
    console.error("Admin login error:", error);
    alert("Something went wrong. Please try again.");
  }
};


// ==============================
// Doctor Login Handler
// ==============================

window.doctorLoginHandler = async function () {

  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  const doctor = { email, password };

  try {

    const response = await postWithApiFallback(DOCTOR_API, doctor);

    if (response.ok) {
      const data = await response.json();

      localStorage.setItem("token", data.token);
      window.selectRole("doctor");

    } else {
      alert("Invalid credentials!");
    }

  } catch (error) {
    console.error("Doctor login error:", error);
    alert("Something went wrong. Please try again.");
  }
};
