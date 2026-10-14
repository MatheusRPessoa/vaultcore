import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  CustomerStatus,
  type Customer,
  type CustomerType,
} from '../domain/customer';

import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from '../domain/customer-repository.interface';

import {
  isValidDocument,
  normalizeDocument,
} from '../utils/validate-document';

export interface CreateCustomerInput {
    type: CustomerType;
    name: string;
    document: string;
    email: string;
}

@Injectable()
export class CreateCustomerUseCase {
    constructor(
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customers: CustomerRepository,
    ) {}

    async execute(input: CreateCustomerInput): Promise<Customer> {
        const document = normalizeDocument(input.document);

        if (!isValidDocument(document, input.type)) {
            throw new BadRequestException(
                'CPF ou CNPJ inválido para o tipo de cliente',
            );
        }

        const existing = await this.customers.findByDocument(document);

        if (existing) {
            throw new ConflictException(
                'Já existe um cliente com este documento',
            );
        }

        try {
            return await this.customers.create({
                id: randomUUID(),
                type: input.type,
                name: input.name.trim(),
                document,
                email: input.email.trim().toLowerCase(),
                status: CustomerStatus.ACTIVE,
            });
        } catch (error: unknown) {
          if (
                typeof error === 'object' &&
                error !== null &&
                'driverError' in error &&
                typeof error.driverError === 'object' &&
                error.driverError !== null &&
                'code' in error.driverError &&
                error.driverError.code === '23505'
          ) {
                throw new ConflictException(
                'Já existe um cliente com este documento',
                );
          }

            throw error;  
        }
    }
}