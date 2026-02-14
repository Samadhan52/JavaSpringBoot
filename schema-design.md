# Smart Clinic Management System - Schema Design

This design is aligned to the provided seed data scripts and naming:
- MySQL tables: `doctor`, `doctor_available_times`, `patient`, `appointment`, `admin`
- MongoDB database/collection: `prescriptions.prescriptions`

## MySQL Database Design

### Table: doctor
- `id`: BIGINT, Primary Key, Auto Increment
- `email`: VARCHAR(120), NOT NULL, UNIQUE
- `name`: VARCHAR(120), NOT NULL
- `password`: VARCHAR(255), NOT NULL
- `phone`: VARCHAR(20), NOT NULL, UNIQUE
- `specialty`: VARCHAR(80), NOT NULL

**Notes (based on inserts):**
- Seed uses values like `555-101-2020`, so `phone` must allow hyphens.
- Insert statement shape:
  - `INSERT INTO doctor (email, name, password, phone, specialty) VALUES (...);`

### Table: doctor_available_times
- `id`: BIGINT, Primary Key, Auto Increment
- `doctor_id`: BIGINT, NOT NULL, Foreign Key -> `doctor(id)`
- `available_times`: VARCHAR(20), NOT NULL (examples: `09:00-10:00`, `14:00-15:00`)

**Recommended constraints:**
- `UNIQUE (doctor_id, available_times)` to avoid duplicate slot rows per doctor.

**Notes (based on inserts):**
- Insert statement shape:
  - `INSERT INTO doctor_available_times (doctor_id, available_times) VALUES (...);`

### Table: patient
- `id`: BIGINT, Primary Key, Auto Increment
- `address`: VARCHAR(255)
- `email`: VARCHAR(120), NOT NULL, UNIQUE
- `name`: VARCHAR(120), NOT NULL
- `password`: VARCHAR(255), NOT NULL
- `phone`: VARCHAR(20), NOT NULL, UNIQUE

**Notes (based on inserts):**
- Seed uses values like `888-111-1111`, so `phone` must allow hyphens.
- Insert statement shape:
  - `INSERT INTO patient (address, email, name, password, phone) VALUES (...);`

### Table: appointment
- `id`: BIGINT, Primary Key, Auto Increment
- `appointment_time`: DATETIME(6), NOT NULL
- `status`: INT, NOT NULL
  - `0 = Scheduled`
  - `1 = Completed`
  - `2 = Cancelled` (reserved/optional)
- `doctor_id`: BIGINT, NOT NULL, Foreign Key -> `doctor(id)`
- `patient_id`: BIGINT, NOT NULL, Foreign Key -> `patient(id)`

**Recommended constraints:**
- `UNIQUE (doctor_id, appointment_time)` to prevent same-doctor double booking at same time.

**Notes (based on inserts):**
- Insert statement shape:
  - `INSERT INTO appointment (appointment_time, status, doctor_id, patient_id) VALUES (...);`

### Table: admin
- `id`: BIGINT, Primary Key, Auto Increment
- `username`: VARCHAR(80), NOT NULL, UNIQUE
- `password`: VARCHAR(255), NOT NULL

**Notes (based on inserts):**
- Insert statement shape:
  - `INSERT INTO admin (username, password) VALUES ('admin', 'admin@1234');`

### Relationship Summary
- One `doctor` -> many `doctor_available_times`
- One `doctor` -> many `appointment`
- One `patient` -> many `appointment`
- `appointment` is the bridge between `doctor` and `patient`

---

## MongoDB Collection Design

### Database and Collection
- Database: `prescriptions`
- Collection: `prescriptions`

Command used in the provided script:
```javascript
use prescriptions;
```

### Document Structure (aligned with provided inserts)
```json
{
  "_id": "ObjectId('6807dd712725f013281e7201')",
  "patientName": "John Smith",
  "appointmentId": 51,
  "medication": "Paracetamol",
  "dosage": "500mg",
  "doctorNotes": "Take 1 tablet every 6 hours.",
  "_class": "com.project.back_end.models.Prescription"
}
```

### Bulk Insert Shape
```javascript
db.prescriptions.insertMany([
  {
    "patientName": "John Smith",
    "appointmentId": 51,
    "medication": "Paracetamol",
    "dosage": "500mg",
    "doctorNotes": "Take 1 tablet every 6 hours.",
    "_class": "com.project.back_end.models.Prescription"
  }
]);
```

### Why MongoDB here?
- Prescription records are semi-flexible and can grow with optional fields.
- Current app mapping already expects `_class: "com.project.back_end.models.Prescription"` in inserted examples.
- `appointmentId` links the document back to relational appointment records.
