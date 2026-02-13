// ==============================
// Imports
// ==============================

import { openModal } from "../components/modals.js";
import { API_BASE_URL } from "../config/config.js";
//import { selectRole } from "../render.js";

// ==============================
// API Endpoints
// ==============================

const ADMIN_API = "/admin/login";
const DOCTOR_API = "/doctor/login";

function buildApiCandidates(url) {
  const candidates = [];

  const addCandidate = (candidate) => {
    if (!candidate || candidates.includes(candidate)) {
      return;
    }
    candidates.push(candidate);
  };

  if (API_BASE_URL) {
    addCandidate(`${API_BASE_URL}${url}`);
    addCandidate(`${API_BASE_URL}/api${url}`);
    return candidates;
  }

  // Root-based routes (work when app is served at `/`).
  addCandidate(url);
  addCandidate(`/api${url}`);

  // Relative routes (work when app is behind a proxy path prefix).
  const pagePath = window.location.pathname;
  const pageDir = pagePath.endsWith("/")
    ? pagePath
    : pagePath.slice(0, pagePath.lastIndexOf("/") + 1);
  const normalizedDir = pageDir === "/" ? "" : pageDir.replace(/\/$/, "");

  addCandidate(`${normalizedDir}${url}`);
  addCandidate(`${normalizedDir}/api${url}`);

  // Extra fallback without leading slash.
  if (url.startsWith("/")) {
    addCandidate(url.slice(1));
  }

  return candidates;
}

async function postWithApiFallback(url, payload) {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };

  const candidateUrls = buildApiCandidates(url);

  // Some deployments expose backend routes under `/api/*`.
  if (API_BASE_URL === "" && !url.startsWith("/api/")) {
    candidateUrls.push(`/api${url}`);
  }

  // If the app is deployed behind a path prefix, a relative URL works better
  // than root-relative (`/doctor/login`).
  if (url.startsWith("/")) {
    candidateUrls.push(url.slice(1));
  }

  let response;
  for (const candidateUrl of candidateUrls) {
    response = await fetch(candidateUrl, request);
    if (response.status !== 404) {
      break;
    }
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
