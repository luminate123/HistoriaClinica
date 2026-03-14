-- Seed data for Historia Clínica demo
-- Run with: wrangler d1 execute historia-clinica --file=tools/scripts/seed.sql

-- Patients
INSERT INTO patients (id, identification_number, first_name, last_name, date_of_birth, gender, blood_type, phone, email, address, emergency_contact_name, emergency_contact_phone) VALUES
('p1', '1012345678', 'María', 'García López', '1985-03-15', 'Femenino', 'O+', '3001234567', 'maria.garcia@email.com', 'Calle 123 #45-67, Bogotá', 'Carlos García', '3009876543'),
('p2', '1098765432', 'Juan', 'Rodríguez Pérez', '1992-07-22', 'Masculino', 'A+', '3112345678', 'juan.rodriguez@email.com', 'Carrera 45 #12-34, Medellín', 'Ana Pérez', '3118765432'),
('p3', '1023456789', 'Laura', 'Martínez Díaz', '1978-11-30', 'Femenino', 'B+', '3201234567', 'laura.martinez@email.com', 'Av. 68 #23-45, Cali', 'Pedro Martínez', '3209876543'),
('p4', '1034567890', 'Andrés', 'López Hernández', '2000-01-10', 'Masculino', 'AB-', '3151234567', 'andres.lopez@email.com', 'Calle 50 #10-20, Barranquilla', 'Sofía López', '3159876543'),
('p5', '1045678901', 'Camila', 'Torres Ruiz', '1995-05-18', 'Femenino', 'O-', '3181234567', 'camila.torres@email.com', 'Carrera 7 #32-10, Bucaramanga', 'Diego Torres', '3189876543');

-- Medical Records
INSERT INTO medical_records (id, patient_id, visit_date, reason_for_visit, symptoms, physical_examination, diagnosis, treatment, prescriptions, notes, doctor_name, created_by_email) VALUES
('r1', 'p1', '2025-01-15T09:00:00', 'Dolor de cabeza persistente', 'Cefalea frontal intensa de 3 días de evolución, fotofobia, náuseas', 'PA: 130/85 mmHg, FC: 82 bpm, T: 36.8°C. Rigidez cervical leve.', 'Migraña sin aura', 'Reposo, hidratación. Evitar desencadenantes luminosos.', 'Sumatriptán 50mg PRN cefalea, máximo 2 dosis/día. Ibuprofeno 400mg c/8h por 5 días.', 'Control en 2 semanas. Llevar diario de cefaleas.', 'Dra. Valentina Restrepo', 'dev@localhost'),
('r2', 'p1', '2025-02-01T14:30:00', 'Control de migraña', 'Episodios de cefalea redujeron a 1/semana. Mejoría significativa.', 'PA: 120/78 mmHg. Examen neurológico normal.', 'Migraña - en mejoría', 'Continuar tratamiento. Incorporar ejercicio aeróbico moderado.', 'Sumatriptán 50mg PRN. Propranolol 40mg/día como profilaxis.', 'Buena respuesta al tratamiento. Se inicia profilaxis.', 'Dra. Valentina Restrepo', 'dev@localhost'),
('r3', 'p2', '2025-01-20T10:00:00', 'Dolor lumbar agudo', 'Dolor en región lumbar baja irradiado a pierna derecha, inicio súbito tras cargar peso, 2 días de evolución.', 'Lasègue positivo derecho a 45°. Fuerza muscular conservada. Reflejos normales.', 'Lumbociatalgia aguda', 'Reposo relativo 48h. Calor local. Ejercicios de Williams.', 'Diclofenaco 75mg c/12h por 7 días. Ciclobenzaprina 10mg noche por 5 días.', 'Solicitar RMN de columna lumbar si no mejora en 2 semanas.', 'Dr. Santiago Mejía', 'dev@localhost'),
('r4', 'p3', '2025-02-10T11:00:00', 'Chequeo general anual', 'Asintomática. Consulta de rutina.', 'PA: 118/72 mmHg, FC: 70 bpm, IMC: 24.2. Examen físico sin alteraciones.', 'Paciente sana - Chequeo anual normal', 'Mantener estilo de vida saludable. Dieta balanceada y ejercicio regular.', 'Ninguna', 'Laboratorios de control solicitados: hemograma, glucemia, perfil lipídico, TSH.', 'Dra. Valentina Restrepo', 'dev@localhost'),
('r5', 'p4', '2025-02-15T16:00:00', 'Infección respiratoria', 'Tos productiva, rinorrea, odinofagia, fiebre de 38.5°C, 4 días de evolución.', 'Faringe hiperémica. Amígdalas con exudado. Adenopatías cervicales bilaterales. Auscultación pulmonar: murmullo vesicular sin sobreagregados.', 'Faringoamigdalitis aguda bacteriana', 'Reposo, abundantes líquidos. Control de fiebre.', 'Amoxicilina 500mg c/8h por 7 días. Acetaminofén 500mg c/6h PRN fiebre.', 'Control en 72h si persiste fiebre.', 'Dr. Santiago Mejía', 'dev@localhost'),
('r6', 'p5', '2025-03-01T08:30:00', 'Dolor abdominal', 'Dolor epigástrico tipo ardor, pirosis, distensión abdominal postprandial, 2 semanas de evolución.', 'Abdomen blando, depresible. Dolor a la palpación en epigastrio. Sin signos de irritación peritoneal.', 'Dispepsia funcional / Gastritis', 'Dieta fraccionada.  Evitar café, picantes, alcohol y AINES.', 'Omeprazol 20mg/día antes del desayuno por 4 semanas. Sucralfato 1g c/8h por 2 semanas.', 'Si no mejora en 4 semanas, solicitar endoscopia digestiva alta.', 'Dra. Valentina Restrepo', 'dev@localhost');

-- Appointments
INSERT INTO appointments (id, patient_id, appointment_date, reason, status, notes) VALUES
('a1', 'p1', '2025-03-20T09:00:00', 'Control de migraña - seguimiento mensual', 'scheduled', 'Traer diario de cefaleas actualizado'),
('a2', 'p2', '2025-03-18T14:00:00', 'Control lumbalgia + revisión RMN', 'scheduled', 'Paciente debe traer resultados de RMN'),
('a3', 'p3', '2025-03-25T10:30:00', 'Revisión de laboratorios', 'scheduled', 'Resultados de hemograma, glucemia, perfil lipídico, TSH'),
('a4', 'p4', '2025-02-18T16:00:00', 'Control post-tratamiento antibiótico', 'completed', 'Paciente mejoró. Sin fiebre desde día 2 del tratamiento.'),
('a5', 'p5', '2025-03-29T08:30:00', 'Control gastritis - 4 semanas', 'scheduled', 'Evaluar respuesta a tratamiento con omeprazol');
