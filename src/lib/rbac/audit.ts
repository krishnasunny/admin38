import { AuditLog } from '../types/role';

const auditLogs: AuditLog[] = [];

export function logAction(
  userId: string,
  userName: string,
  action: string,
  resource: string,
  details: string
): void {
  const log: AuditLog = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    userName,
    action,
    resource,
    details,
    timestamp: new Date().toISOString(),
  };
  
  auditLogs.push(log);
  // In a real application, this would be saved to a database
  console.log('Audit Log:', log);
}

export function getAuditLogs(): AuditLog[] {
  return [...auditLogs];
}