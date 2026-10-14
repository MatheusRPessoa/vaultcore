
import 'dotenv/config';

import { config } from 'dotenv';
import { join } from 'node:path';
import { DataSource } from 'typeorm';

import { CustomerEntity } from '../modules/customers/entities/customer.entity';

config({
  path: process.env.DOTENV_CONFIG_PATH ?? '.env',
});

const isTest = process.env.NODE_ENV === 'test';

if (isTest && process.env.DATABASE_NAME !== 'vaultcore_test') {
  throw new Error(
    'Ambiente de teste deve utilizar o banco vaultcore_test',
  );
}

if (isTest && Number(process.env.DATABASE_PORT) !== 5434) {
  throw new Error(
    'Ambiente de teste deve utilizar a porta 5434',
  );
}

export default new DataSource({
  type: 'postgres',

  host: process.env.DATABASE_HOST ?? '127.0.0.1',
  port: Number(process.env.DATABASE_PORT ?? 5433),

  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  entities: [CustomerEntity],

  migrations: [
    join(process.cwd(), 'dist/database/migrations/*.js'),
  ],

  synchronize: false,
  connectTimeoutMS: 5000,
});

