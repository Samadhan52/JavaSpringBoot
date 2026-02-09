// =====================================================
// Patient Services Module
// Handles all API communication related to patients
// =====================================================

import { API_BASE_URL } from "../config/config.js";

// Base endpoint for patient-related APIs
const PATIENT_API = API_BASE_URL + "/patient";


/* =====================================================
   PATIENT SIGNUP
   Creates a new patient in the database
   ===================================================== */
export async function patientSignup(data) {
  try {
    const response = await fetch(PATIENT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Signup failed"
      };
    }

    return {
      success: true,
      message: result.message || "Signup successful"
    };

  } catch (error) {
    console.error("Error :: patientSignup ::", error);
    return {
      success: false,
      message: "Network error. Please try again."
    };
  }
}


/* =====================================================
   PATIENT LOGIN
   Authenticates patient and returns fetch response
   ===================================================== */
export async function patientLogin(data) {
  try {
    const response = await fetch(`${PATIENT_API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return response; // Let frontend handle token extraction

  } catch (error) {
    console.error("Error :: patientLogin ::", error);
    throw error; // Let caller handle login failure
  }
}


/* =====================================================
   GET LOGGED-IN PATIENT DATA
   Used during booking & profile rendering
   ===================================================== */
export async function getPatientData(token) {
  try {
    const response = await fetch(`${PATIENT_API}/${token}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      return data.patient || null;
    }

    return null;

  } catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}


/* =====================================================
   GET PATIENT APPOINTMENTS
   Works for both Doctor & Patient dashboards
   ===================================================== */
export async function getPatientAppointments(id, token, user) {
  try {
    const response = await fetch(
      `${PATIENT_API}/${id}/${user}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (response.ok) {
      return data.appointments || [];
    }

    return [];

  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}


/* =====================================================
   FILTER APPOINTMENTS
   Filters by condition and patient name
   ===================================================== */
export async function filterAppointments(condition = "", name = "", token) {
  try {
    const response = await fetch(
      `${PATIENT_API}/filter/${condition}/${name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      console.error("Failed to filter appointments");
      return [];
    }

    const data = await response.json();
    return data.appointments || [];

  } catch (error) {
    console.error("Filter error:", error);
    alert("Something went wrong while filtering appointments.");
    return [];
  }
}
