
export const Role = {
    ADMIN: 'ADMIN',
    SUPERADMIN: 'SUPERADMIN',
    STORE_MANAGER: 'STORE_MANAGER',
    ASST_STORE_MANAGER: 'ASST_STORE_MANAGER',
    CLERK: 'CLERK',
    CASHIER: 'CASHIER',
    INVENTORY_CLERK: 'INVENTORY_CLERK',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface UserSession {
    session: string;
    id: string;
    username: string;
    role: Role;
}

export interface HealthStatus {
    status: 'ok' | 'error';
    timestamp: string;
}