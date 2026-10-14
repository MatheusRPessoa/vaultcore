export enum CustomerType {
    INDIVIDUAL = 'INDIVIDUAL',
    BUSINESS = 'BUSINESS',
}

export enum CustomerStatus {
    ACTIVE = 'ACTIVE',
    BLOCKED = 'BLOCKED',
    INACTIVE = 'INACTIVE',
}

export interface Customer {
    id: string;
    type: CustomerType;
    name: string;
    document: string;
    email: string;
    status: CustomerStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCustomerData {
    id: string;
    type: CustomerType;
    name: string;
    document: string;
    email: string;
    status: CustomerStatus;
}