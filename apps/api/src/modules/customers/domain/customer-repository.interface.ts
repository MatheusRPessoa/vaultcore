import { CreateCustomerData, Customer } from "./customer";

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface CustomerRepository {
    findByDocument(document: string): Promise<Customer | null>;
    create(data: CreateCustomerData): Promise<Customer>;
}
