import { Injectable } from '@nestjs/common';

import { CreateCustomerUseCase } from './use-cases/create-customer.use-case';
import type { CreateCustomerInput } from './use-cases/create-customer.use-case';
import type { Customer } from './domain/customer';

@Injectable()
export class CustomersService {
    constructor(
        private readonly createCustomerUseCase: CreateCustomerUseCase,
    ) {}

    async create(data: CreateCustomerInput): Promise<Customer> {
        return this.createCustomerUseCase.execute(data);
    }
}