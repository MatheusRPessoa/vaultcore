import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type {
  Customer,
  CreateCustomerData,
} from '../domain/customer';

import type { CustomerRepository } from '../domain/customer-repository.interface';

import { CustomerEntity } from '../entities/customer.entity';

@Injectable()
export class TypeOrmCustomerRepository
    implements CustomerRepository
{
    constructor(
        @InjectRepository(CustomerEntity)
        private readonly repository: Repository<CustomerEntity>,
    ) {}

    async findByDocument(document: string): Promise<Customer | null> {
        const entity = await this.repository.findOne({
            where: { DOCUMENT: document }
        })
        
        if (!entity) {
            return null;
        }

        return this.toDomain(entity)
    }

    async create(
        data: CreateCustomerData,
    ): Promise<Customer> {
        const entity = this.repository.create({
            ID: data.id,
            TYPE: data.type,
            NAME: data.name,
            DOCUMENT: data.document,
            EMAIL: data.email,
            STATUS: data.status,
        });

        const savedEntity = await this.repository.save(entity);

        return this.toDomain(savedEntity);
    }

    private toDomain(entity: CustomerEntity): Customer {
        return {
            id: entity.ID,
            type: entity.TYPE,
            name: entity.NAME,
            document: entity.DOCUMENT,
            email: entity.EMAIL,
            status: entity.STATUS,
            createdAt: entity.CREATED_AT,
            updatedAt: entity.UPDATED_AT,
        };
    }
}