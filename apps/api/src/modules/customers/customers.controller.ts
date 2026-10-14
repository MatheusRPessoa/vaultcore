import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
    constructor(
        private readonly customersService: CustomersService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Cadastrar cliente Pessoa Física ou Jurídica',
    })
    async create(@Body() dto: CreateCustomerDto) {
        return this.customersService.create(dto);
    }
}