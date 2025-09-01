/*
  Notes for safe migration with existing User rows:

  - We recreate the User table with the new required columns and defaults.
  - We carry over old data: id, email, and map name -> username.
  - For rows without name, we fallback to 'temp_user'.
  - passwordHash is initialized as empty string '' (you should update real hashes later).
  - updatedAt is set to CURRENT_TIMESTAMP.
*/

/* ======== Create tables (generated) ======== */
CREATE TABLE "Role" (
                        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                        "code" TEXT NOT NULL,
                        "name" TEXT NOT NULL
);

CREATE TABLE "Permission" (
                              "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                              "code" TEXT NOT NULL,
                              "name" TEXT NOT NULL
);

CREATE TABLE "UserRole" (
                            "userId" INTEGER NOT NULL,
                            "roleId" INTEGER NOT NULL,

                            PRIMARY KEY ("userId", "roleId"),
                            CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                            CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "RolePermission" (
                                  "roleId" INTEGER NOT NULL,
                                  "permissionId" INTEGER NOT NULL,

                                  PRIMARY KEY ("roleId", "permissionId"),
                                  CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                                  CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Organization" (
                                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                "name" TEXT NOT NULL,
                                "type" TEXT,
                                "phone" TEXT,
                                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Location" (
                            "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                            "organizationId" INTEGER NOT NULL,
                            "name" TEXT NOT NULL,
                            "type" TEXT,
                            "floor" TEXT,
                            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            "updatedAt" DATETIME NOT NULL,
                            CONSTRAINT "Location_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Practitioner" (
                                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                "organizationId" INTEGER,
                                "licenseNo" TEXT,
                                "name" TEXT NOT NULL,
                                "specialty" TEXT,
                                "phone" TEXT,
                                "userId" INTEGER,
                                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" DATETIME NOT NULL,
                                CONSTRAINT "Practitioner_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
                                CONSTRAINT "Practitioner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Patient" (
                           "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                           "mrn" TEXT NOT NULL,
                           "name" TEXT NOT NULL,
                           "birthDate" DATETIME,
                           "sex" TEXT,
                           "phone" TEXT,
                           "email" TEXT,
                           "address" TEXT,
                           "insuranceNo" TEXT,
                           "userId" INTEGER,
                           "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           "updatedAt" DATETIME NOT NULL,
                           CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Encounter" (
                             "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                             "patientId" INTEGER NOT NULL,
                             "practitionerId" INTEGER,
                             "locationId" INTEGER,
                             "type" TEXT NOT NULL,
                             "startAt" DATETIME NOT NULL,
                             "endAt" DATETIME,
                             "reason" TEXT,
                             "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             "updatedAt" DATETIME NOT NULL,
                             CONSTRAINT "Encounter_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                             CONSTRAINT "Encounter_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
                             CONSTRAINT "Encounter_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Condition" (
                             "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                             "patientId" INTEGER NOT NULL,
                             "encounterId" INTEGER,
                             "codeIcd10" TEXT NOT NULL,
                             "clinicalStatus" TEXT,
                             "onsetDate" DATETIME,
                             "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             "updatedAt" DATETIME NOT NULL,
                             CONSTRAINT "Condition_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                             CONSTRAINT "Condition_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Observation" (
                               "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                               "patientId" INTEGER NOT NULL,
                               "encounterId" INTEGER,
                               "category" TEXT NOT NULL,
                               "codeLoinc" TEXT,
                               "value" TEXT,
                               "unit" TEXT,
                               "refRange" TEXT,
                               "effectiveAt" DATETIME NOT NULL,
                               "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               "updatedAt" DATETIME NOT NULL,
                               CONSTRAINT "Observation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                               CONSTRAINT "Observation_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Procedure" (
                             "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                             "patientId" INTEGER NOT NULL,
                             "encounterId" INTEGER,
                             "code" TEXT,
                             "description" TEXT,
                             "performedAt" DATETIME,
                             "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             "updatedAt" DATETIME NOT NULL,
                             CONSTRAINT "Procedure_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                             CONSTRAINT "Procedure_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "AllergyIntolerance" (
                                      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                      "patientId" INTEGER NOT NULL,
                                      "substance" TEXT NOT NULL,
                                      "criticality" TEXT,
                                      "reaction" TEXT,
                                      "recordedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
                                      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      "updatedAt" DATETIME NOT NULL,
                                      CONSTRAINT "AllergyIntolerance_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Medication" (
                              "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                              "codeAtc" TEXT,
                              "name" TEXT NOT NULL,
                              "form" TEXT,
                              "strength" TEXT
);

CREATE TABLE "MedicationRequest" (
                                     "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                     "patientId" INTEGER NOT NULL,
                                     "encounterId" INTEGER,
                                     "medicationId" INTEGER NOT NULL,
                                     "dose" TEXT,
                                     "route" TEXT,
                                     "frequency" TEXT,
                                     "durationDays" INTEGER,
                                     "status" TEXT NOT NULL DEFAULT 'active',
                                     "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     "updatedAt" DATETIME NOT NULL,
                                     CONSTRAINT "MedicationRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                                     CONSTRAINT "MedicationRequest_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
                                     CONSTRAINT "MedicationRequest_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Appointment" (
                               "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                               "patientId" INTEGER NOT NULL,
                               "practitionerId" INTEGER,
                               "locationId" INTEGER,
                               "status" TEXT NOT NULL DEFAULT 'proposed',
                               "startAt" DATETIME NOT NULL,
                               "endAt" DATETIME NOT NULL,
                               "reason" TEXT,
                               "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               "updatedAt" DATETIME NOT NULL,
                               CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                               CONSTRAINT "Appointment_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
                               CONSTRAINT "Appointment_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Slot" (
                        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                        "practitionerId" INTEGER NOT NULL,
                        "startAt" DATETIME NOT NULL,
                        "endAt" DATETIME NOT NULL,
                        "capacity" INTEGER NOT NULL DEFAULT 1,
                        CONSTRAINT "Slot_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ServiceRequest" (
                                  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                  "patientId" INTEGER NOT NULL,
                                  "encounterId" INTEGER,
                                  "category" TEXT NOT NULL,
                                  "code" TEXT,
                                  "priority" TEXT,
                                  "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  "updatedAt" DATETIME NOT NULL,
                                  CONSTRAINT "ServiceRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                                  CONSTRAINT "ServiceRequest_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "DiagnosticReport" (
                                    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                    "patientId" INTEGER NOT NULL,
                                    "serviceRequestId" INTEGER NOT NULL,
                                    "conclusion" TEXT,
                                    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    "updatedAt" DATETIME NOT NULL,
                                    CONSTRAINT "DiagnosticReport_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                                    CONSTRAINT "DiagnosticReport_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "LabResult" (
                             "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                             "diagnosticReportId" INTEGER NOT NULL,
                             "codeLoinc" TEXT,
                             "value" TEXT,
                             "unit" TEXT,
                             "refRange" TEXT,
                             "abnormalFlag" TEXT,
                             CONSTRAINT "LabResult_diagnosticReportId_fkey" FOREIGN KEY ("diagnosticReportId") REFERENCES "DiagnosticReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Attachment" (
                              "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                              "patientId" INTEGER,
                              "encounterId" INTEGER,
                              "type" TEXT NOT NULL DEFAULT 'other',
                              "url" TEXT NOT NULL,
                              "title" TEXT,
                              "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              CONSTRAINT "Attachment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
                              CONSTRAINT "Attachment_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "AuditLog" (
                            "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                            "userId" INTEGER,
                            "action" TEXT NOT NULL,
                            "resourceType" TEXT NOT NULL,
                            "resourceId" INTEGER,
                            "ip" TEXT,
                            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

/* ======== Redefine User with data carry-over ======== */
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_User" (
                            "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                            "username" TEXT NOT NULL DEFAULT 'temp_user',
                            "email" TEXT,
                            "passwordHash" TEXT NOT NULL DEFAULT '',
                            "status" TEXT NOT NULL DEFAULT 'active',
                            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

/* Carry over old data: id/email, and map old name -> username. */
INSERT INTO "new_User" ("id", "username", "email", "passwordHash", "createdAt", "updatedAt")
SELECT
    "id",
    COALESCE("name", 'temp_user') as "username",
    "email",
    '' as "passwordHash",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "User";

DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";

/* Indexes on User */
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/* ======== Indexes (generated) ======== */
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");
CREATE INDEX "Location_organizationId_idx" ON "Location"("organizationId");
CREATE UNIQUE INDEX "Practitioner_licenseNo_key" ON "Practitioner"("licenseNo");
CREATE UNIQUE INDEX "Practitioner_userId_key" ON "Practitioner"("userId");
CREATE INDEX "Practitioner_organizationId_idx" ON "Practitioner"("organizationId");
CREATE UNIQUE INDEX "Patient_mrn_key" ON "Patient"("mrn");
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");
CREATE INDEX "Patient_mrn_idx" ON "Patient"("mrn");
CREATE INDEX "Encounter_patientId_idx" ON "Encounter"("patientId");
CREATE INDEX "Encounter_practitionerId_idx" ON "Encounter"("practitionerId");
CREATE INDEX "Encounter_locationId_idx" ON "Encounter"("locationId");
CREATE INDEX "Condition_patientId_idx" ON "Condition"("patientId");
CREATE INDEX "Condition_encounterId_idx" ON "Condition"("encounterId");
CREATE INDEX "Condition_codeIcd10_idx" ON "Condition"("codeIcd10");
CREATE INDEX "Observation_patientId_idx" ON "Observation"("patientId");
CREATE INDEX "Observation_encounterId_idx" ON "Observation"("encounterId");
CREATE INDEX "Observation_category_idx" ON "Observation"("category");
CREATE INDEX "Procedure_patientId_idx" ON "Procedure"("patientId");
CREATE INDEX "Procedure_encounterId_idx" ON "Procedure"("encounterId");
CREATE INDEX "AllergyIntolerance_patientId_idx" ON "AllergyIntolerance"("patientId");
CREATE INDEX "MedicationRequest_patientId_idx" ON "MedicationRequest"("patientId");
CREATE INDEX "MedicationRequest_encounterId_idx" ON "MedicationRequest"("encounterId");
CREATE INDEX "MedicationRequest_medicationId_idx" ON "MedicationRequest"("medicationId");
CREATE INDEX "Appointment_patientId_idx" ON "Appointment"("patientId");
CREATE INDEX "Appointment_practitionerId_idx" ON "Appointment"("practitionerId");
CREATE INDEX "Appointment_locationId_idx" ON "Appointment"("locationId");
CREATE INDEX "Appointment_startAt_idx" ON "Appointment"("startAt");
CREATE INDEX "Slot_practitionerId_startAt_idx" ON "Slot"("practitionerId", "startAt");
CREATE INDEX "ServiceRequest_patientId_idx" ON "ServiceRequest"("patientId");
CREATE INDEX "ServiceRequest_encounterId_idx" ON "ServiceRequest"("encounterId");
CREATE INDEX "DiagnosticReport_patientId_idx" ON "DiagnosticReport"("patientId");
CREATE INDEX "DiagnosticReport_serviceRequestId_idx" ON "DiagnosticReport"("serviceRequestId");
CREATE INDEX "LabResult_diagnosticReportId_idx" ON "LabResult"("diagnosticReportId");
CREATE INDEX "Attachment_patientId_idx" ON "Attachment"("patientId");
CREATE INDEX "Attachment_encounterId_idx" ON "Attachment"("encounterId");
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");
