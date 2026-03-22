/**
 * Audit log helper — records key actions in the system.
 */
import prisma from './prisma.js';

export async function createAuditLog({
    action,
    entityType,
    entityId,
    userId = null,
    patientId = null,
    projectId = null,
    details = '',
}) {
    return prisma.auditLog.create({
        data: {
            action,
            entityType,
            entityId,
            userId,
            patientId,
            projectId,
            details,
        },
    });
}

// Action constants
export const AuditActions = {
    DOCUMENT_UPLOAD: 'DOCUMENT_UPLOAD',
    PATIENT_INVITE: 'PATIENT_INVITE',
    CONSENT_SUBMITTED: 'CONSENT_SUBMITTED',
    ESCALATION_SUBMITTED: 'ESCALATION_SUBMITTED',
    STAFF_RESPONSE: 'STAFF_RESPONSE',
    PROJECT_CREATED: 'PROJECT_CREATED',
};
