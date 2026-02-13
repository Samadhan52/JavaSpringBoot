// Import API base URL from config
import { API_BASE_URL } from "../config/config.js";

// Base doctor endpoint
const DOCTOR_API = API_BASE_URL + "/doctor";


/* =====================================================
   GET ALL DOCTORS
   ===================================================== */
export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API);

    if (!response.ok) {
      throw new Error("Failed to fetch doctors");
    }

    const data = await response.json();

    // Return doctor list safely
    return data.doctors || data || [];

  } catch (error) {
    console.error("Error fetching doctors:", error);
    return []; // Prevent frontend crash
  }
}


/* =====================================================
   DELETE DOCTOR (Admin Only)
   ===================================================== */
export async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete doctor"
      };
    }

    return {
      success: true,
      message: data.message || "Doctor deleted successfully"
    };

  } catch (error) {
    console.error("Delete doctor error:", error);
    return {
      success: false,
      message: "Something went wrong while deleting doctor"
    };
  }
}


/* =====================================================
   SAVE (ADD) DOCTOR (Admin Only)
   ===================================================== */
export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(DOCTOR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(doctor)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to save doctor"
      };
    }

    return {
      success: true,
      message: data.message || "Doctor added successfully"
    };

  } catch (error) {
    console.error("Save doctor error:", error);
    return {
      success: false,
      message: "Something went wrong while saving doctor"
    };
  }
}


/* =====================================================
   FILTER DOCTORS
   ===================================================== */
export async function filterDoctors(name = "", time = "", specialty = "") {
  try {
    // Build query parameters dynamically
    const params = new URLSearchParams();

    if (name) params.append("name", name);
    if (time) params.append("time", time);
    if (specialty) params.append("specialty", specialty);

   const query = params.toString();
    const url = query ? `${DOCTOR_API}/filter?${query}` : `${DOCTOR_API}/filter`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to filter doctors");
    }

    const data = await response.json();

    return data?.doctors || [];

  } catch (error) {
    console.error("Filter doctors error:", error);
    alert("Failed to filter doctors.");
    return [];
  }
}
