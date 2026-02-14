# User Stories – Smart Clinic Management System

This document contains all user stories for Admin, Patient, and Doctor roles.

---

# 👨‍💼 Admin User Stories

---

## Title: Admin Login
_As an admin, I want to log into the portal with my username and password, so that I can manage the platform securely._

**Acceptance Criteria:**
1. Admin can enter username and password.
2. System validates credentials.
3. Admin is redirected to dashboard upon successful login.

**Priority:** High  
**Story Points:** 5  

**Notes:**
- Display error message for invalid login attempts.

---

## Title: Admin Logout
_As an admin, I want to log out of the portal, so that I can protect system access._

**Acceptance Criteria:**
1. Admin can click logout button.
2. Session is terminated.
3. Admin is redirected to login page.

**Priority:** High  
**Story Points:** 2  

**Notes:**
- Clear authentication token from localStorage.

---

## Title: Add Doctor Profile
_As an admin, I want to add doctors to the portal, so that patients can book appointments with them._

**Acceptance Criteria:**
1. Admin can enter doctor details (name, specialization, contact information).
2. Required fields are validated.
3. Doctor profile is saved in the database.

**Priority:** High  
**Story Points:** 5  

**Notes:**
- Doctor email must be unique.

---

## Title: Delete Doctor Profile
_As an admin, I want to delete a doctor's profile from the portal, so that outdated profiles are removed._

**Acceptance Criteria:**
1. Admin selects doctor profile.
2. Confirmation prompt appears before deletion.
3. Doctor profile is removed from the database.

**Priority:** Medium  
**Story Points:** 3  

**Notes:**
- Prevent deletion if doctor has upcoming appointments.

---

## Title: Monthly Appointment Report
_As an admin, I want to run a stored procedure in MySQL CLI to get the number of appointments per month, so that I can track usage statistics._

**Acceptance Criteria:**
1. Stored procedure returns appointment count grouped by month.
2. Results are accurate.
3. Output is displayed correctly in MySQL CLI.

**Priority:** Medium  
**Story Points:** 5  

**Notes:**
- Use COUNT and GROUP BY in the stored procedure.

---

# 🧑‍⚕️ Patient User Stories

---

## Title: Browse Doctors
_As a patient, I want to view a list of doctors without logging in, so that I can explore options before registering._

**Acceptance Criteria:**
1. Doctor list loads without authentication.
2. Displays doctor name and specialization.
3. Search and filter functionality works.

**Priority:** High  
**Story Points:** 3  

**Notes:**
- Doctor contact details should not be fully visible before login.

---

## Title: Patient Registration
_As a patient, I want to sign up using my email and password, so that I can book appointments._

**Acceptance Criteria:**
1. Email must be unique.
2. Password meets security requirements.
3. User is redirected after successful registration.

**Priority:** High  
**Story Points:** 5  

**Notes:**
- Validate email format.

---

## Title: Patient Login
_As a patient, I want to log into the portal, so that I can manage my bookings._

**Acceptance Criteria:**
1. Valid credentials allow login.
2. Invalid credentials show an error message.
3. Dashboard loads after login.

**Priority:** High  
**Story Points:** 5  

**Notes:**
- Use secure authentication.

---

## Title: Book Appointment
_As a patient, I want to log in and book an hour-long appointment, so that I can consult with a doctor._

**Acceptance Criteria:**
1. Patient selects an available time slot.
2. Appointment duration is one hour.
3. Booking confirmation is displayed.

**Priority:** High  
**Story Points:** 8  

**Notes:**
- Prevent double booking.

---

## Title: View Upcoming Appointments
_As a patient, I want to view my upcoming appointments, so that I can prepare accordingly._

**Acceptance Criteria:**
1. List shows only future appointments.
2. Displays doctor name and appointment time.
3. Data loads correctly from backend.

**Priority:** Medium  
**Story Points:** 3  

**Notes:**
- Past appointments should not appear in this list.

---

## Title: Patient Logout
_As a patient, I want to log out of the portal, so that I can secure my account._

**Acceptance Criteria:**
1. Logout button is visible.
2. Session is cleared.
3. User is redirected to login page.

**Priority:** Medium  
**Story Points:** 2  

**Notes:**
- Clear stored token from localStorage.

---

# 👨‍⚕️ Doctor User Stories

---

## Title: Doctor Login
_As a doctor, I want to log into the portal, so that I can manage my appointments._

**Acceptance Criteria:**
1. Doctor enters valid credentials.
2. Dashboard loads successfully.
3. Invalid login shows error message.

**Priority:** High  
**Story Points:** 5  

**Notes:**
- Secure authentication required.

---

## Title: Doctor Logout
_As a doctor, I want to log out of the portal, so that I can protect my data._

**Acceptance Criteria:**
1. Logout option is visible.
2. Session is cleared.
3. Doctor is redirected to login page.

**Priority:** Medium  
**Story Points:** 2  

**Notes:**
- Clear session token after logout.

---

## Title: View Appointment Calendar
_As a doctor, I want to view my appointment calendar, so that I can stay organized._

**Acceptance Criteria:**
1. Calendar displays upcoming appointments.
2. Shows patient name and appointment time.
3. Data updates dynamically.

**Priority:** High  
**Story Points:** 5  

**Notes:**
- Only future appointments should be displayed.

---

## Title: Mark Unavailability
_As a doctor, I want to mark my unavailability, so that patients only see available slots._

**Acceptance Criteria:**
1. Doctor selects unavailable dates and times.
2. Unavailable slots are hidden from patients.
3. Changes are saved in database.

**Priority:** High  
**Story Points:** 5  

**Notes:**
- Prevent marking slots that already have booked appointments.

---

## Title: Update Doctor Profile
_As a doctor, I want to update my specialization and contact information, so that patients have up-to-date information._

**Acceptance Criteria:**
1. Doctor can edit profile fields.
2. Validation is applied to inputs.
3. Changes persist after refresh.

**Priority:** Medium  
**Story Points:** 3  

**Notes:**
- Email format must be validated.

---

## Title: View Patient Details
_As a doctor, I want to view patient details for upcoming appointments, so that I can be prepared._

**Acceptance Criteria:**
1. Doctor can click an appointment entry.
2. Patient name and contact details are visible.
3. Information loads securely from backend.

**Priority:** High  
**Story Points:** 5  

**Notes:**
- Ensure patient data privacy is maintained.
