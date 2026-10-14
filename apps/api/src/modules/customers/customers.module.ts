import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

import { CustomerEntity } from './entities/customer.entity';

import { CreateCustomerUseCase } from './use-cases/create-customer.use-case';

import { CUSTOMER_REPOSITORY } from './domain/customer-repository.interface';

import { TypeOrmCustomerRepository } from './repositories/typeorm-customer.repository';

@Module({
    imports: [TypeOrmModule.forFeature([CustomerEntity])],
    controllers: [CustomersController],
    providers: [
        CustomersService,
        CreateCustomerUseCase,
        {
            provide: CUSTOMER_REPOSITORY,
            useClass: TypeOrmCustomerRepository,
        },
    ],
})
export class CustomersModule {}