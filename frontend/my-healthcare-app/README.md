7. Admin Panel (For Doctors & Moderators)
Approve AI Diagnosis: POST /api/admin/diagnosis/approve
Manage Doctor Profiles: POST /api/admin/doctors/add
View Patient Reports: GET /api/admin/patients/{patientId}
Handle Complaints: POST /api/admin/complaints/review
8. Notifications & Alerts
Send Prescription Reminders: POST /api/notifications/reminder
Appointment Reminders: GET /api/notifications/appointments
Alert for Emergency Conditions: POST /api/notifications/emergency