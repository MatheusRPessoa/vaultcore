
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CustomerType } from '../domain/customer';

export class CreateCustomerDto {
  @ApiProperty({ enum: CustomerType })
  @IsEnum(CustomerType)
  type!: CustomerType;

  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ApiProperty({ example: '52998224725' })
  @IsString()
  @Matches(/^(\d{11}|\d{14})$/)
  document!: string;

  @ApiProperty({ example: 'maria@email.com' })
  @IsEmail()
  email!: string;
}
