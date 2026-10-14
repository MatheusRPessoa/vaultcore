
import 'dotenv/config';
import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { CustomerEntity } from '../modules/customers/entities/customer.entity';

export default new DataSource({
  type: 'postgres',

  host: process.env.DATABASE_HOST ?? '127.0.0.1',
  port: Number(process.env.DATABASE_PORT ?? 5433),

  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  entities: [CustomerEntity],
  migrations: [
    join(__dirname, 'migrations', '*.{js,ts}'),
  ],

  synchronize: false,
  connectTimeoutMS: 5000,
});
