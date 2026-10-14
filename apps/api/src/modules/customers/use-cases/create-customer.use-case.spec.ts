import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import {
  CustomerStatus,
  CustomerType,
  type Customer,
} from '../domain/customer';

import type { CustomerRepository } from '../domain/customer-repository.interface';

import { CreateCustomerUseCase } from './create-customer.use-case';
import { jest } from '@jest/globals';

describe('CreateCustomerUseCase', () => {
    let useCase: CreateCustomerUseCase;
    let repository: jest.Mocked<CustomerRepository>;

    const input = {
        type: CustomerType.INDIVIDUAL,
        name: 'Maria Silva',
        document: '52998224725',
        email: 'MARIA@EMAIL.COM',
    };

    beforeEach(() => {
        repository = {
            findByDocument: jest.fn(),
            create: jest.fn(),
        };

        useCase = new CreateCustomerUseCase(repository);
    });

    it('should create an individual customer', async () => {
        repository.findByDocument.mockResolvedValue(null);

        repository.create.mockImplementation(async (data) => ({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const result = await useCase.execute(input);

        expect(result).toMatchObject({
            type: CustomerType.INDIVIDUAL,
            name: 'Maria Silva',
            document: '52998224725',
            email: 'maria@email.com',
            status: CustomerStatus.ACTIVE, 
        });

        expect(result.id).toEqual(expect.any(String));
        expect(repository.create).toHaveBeenCalledTimes(1);
    });

    it('should reject invalid CPF', async () => {
        await expect(
            useCase.execute({
                ...input,
                document: '12345678901'
            }),
        ).rejects.toThrow(BadRequestException);
    });

    it('should reject invalid CNPJ', async () => {
        await expect(
            useCase.execute({
            type: CustomerType.BUSINESS,
            name: 'Empresa Inválida LTDA',
            document: '12345678000100',
            email: 'contato@empresa.com',
            }),
        ).rejects.toThrow(BadRequestException);

        expect(repository.create).not.toHaveBeenCalled();
    });

    it('should reject duplicated documents', async () => {
        repository.findByDocument.mockResolvedValue({
            id: 'existing-id',
        } as Customer);

        await expect(useCase.execute(input)).rejects.toThrow(
            ConflictException,
        );

        expect(repository.create).not.toHaveBeenCalled();
    });

    it('should create a business customer', async () => {
        repository.findByDocument.mockResolvedValue(null);

        repository.create.mockImplementation(async (data) => ({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const result = await useCase.execute({
            type: CustomerType.BUSINESS,
            name: 'Empresa Exemplo LTDA',
            document: '11222333000181',
            email: 'contato@empresa.com',
        });

        expect(result.type).toBe(CustomerType.BUSINESS);
        expect(result.document).toBe('11222333000181')
    })
})