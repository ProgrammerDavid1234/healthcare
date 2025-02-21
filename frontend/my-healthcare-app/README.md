
1. Patient-Doctor Interaction
POST /messages – Allow patients and doctors to send messages.
GET /messages/:chatId – Retrieve chat history between a patient and doctor.
POST /reviews – Allow patients to leave reviews for doctors.
GET /reviews/:doctorId – Retrieve reviews for a specific doctor.
2. Advanced Appointment Features
PUT /appointments/:id/reschedule – Allow rescheduling of appointments.
GET /appointments/upcoming – Fetch upcoming appointments for a user.
3. Payment & Billing
POST /payments – Process payments for medical services.
GET /payments/:userId – Retrieve payment history for a user.
4. Notifications & Reminders
POST /notifications – Send appointment reminders or medical updates.
GET /notifications/:userId – Fetch user-specific notifications.
5. Admin Management
POST /admin/createUser – Allow admin to create users.
DELETE /admin/deleteUser/:id – Allow admin to delete users.
GET /admin/stats – Retrieve system analytics (number of users, doctors, appointments, etc.).
6. Admin Panel (For Doctors & Moderators)
Approve AI Diagnosis: POST /api/admin/diagnosis/approve
Manage Doctor Profiles: POST /api/admin/doctors/add
View Patient Reports: GET /api/admin/patients/{patientId}
Handle Complaints: POST /api/admin/complaints/review
7. Notifications & Alerts
Send Prescription Reminders: POST /api/notifications/reminder
Appointment Reminders: GET /api/notifications/appointments
Alert for Emergency Conditions: POST /api/notifications/emergency
