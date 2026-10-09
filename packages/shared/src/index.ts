


export enum Role {
    Admin = 'admin',
    Cashier = 'cashier',
}

export interface UserSession {
    id: string;
    username: string;
    role: Role;
}

export interface HealthStatus {
    status: 'ok' | 'error';
    timestamp: string;
}