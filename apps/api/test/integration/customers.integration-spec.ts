
import { randomUUID } from 'node:crypto';
import type { Repository } from 'typeorm';

import dataSource from '../../src/database/data-source.js';
import { CustomerEntity } from '../../src/modules/customers/entities/customer.entity.js';
import {
  CustomerStatus,
  CustomerType,
} from '../../src/modules/customers/domain/customer.js';
import { TypeOrmCustomerRepository } from '../../src/modules/customers/repositories/typeorm-customer.repository.js';

describe('Customers Repository Integration', () => {
  let ormRepository: Repository<CustomerEntity>;
  let repository: TypeOrmCustomerRepository;

  const createdIds: string[] = [];

    beforeAll(async () => {
        const options = dataSource.options;

        if (
            options.type !== 'postgres' ||
            options.database !== 'vaultcore_test' ||
            options.port !== 5434
        ) {
            throw new Error(
            'Integration tests must use vaultcore_test on port 5434',
            );
        }

        await dataSource.initialize();

        ormRepository = dataSource.getRepository(CustomerEntity);

        repository = new TypeOrmCustomerRepository(ormRepository);
    });


    afterEach(async () => {
        if (createdIds.length > 0) {
        await ormRepository.delete(createdIds.splice(0));
        }
    });

    afterAll(async () => {
        if (dataSource?.isInitialized) {
        await dataSource.destroy();
        }
  });

  it('should persist an individual customer', async () => {
    const id = randomUUID();
    createdIds.push(id);

    const customer = await repository.create({
      id,
      type: CustomerType.INDIVIDUAL,
      name: 'Maria Silva',
      document: '52998224725',
      email: 'maria@email.com',
      status: CustomerStatus.ACTIVE,
    });

    expect(customer.id).toBe(id);
    expect(customer.createdAt).toBeInstanceOf(Date);

    const persisted = await ormRepository.findOneBy({
      ID: id,
    });

    expect(persisted?.DOCUMENT).toBe('52998224725');
  });

  it('should find a customer by document', async () => {
    const id = randomUUID();
    createdIds.push(id);

    await repository.create({
      id,
      type: CustomerType.BUSINESS,
      name: 'Empresa Exemplo LTDA',
      document: '11222333000181',
      email: 'contato@empresa.com',
      status: CustomerStatus.ACTIVE,
    });

    const customer = await repository.findByDocument(
      '11222333000181',
    );

    expect(customer?.id).toBe(id);
    expect(customer?.type).toBe(CustomerType.BUSINESS);
  });

  it('should return null for an unknown document', async () => {
    const customer = await repository.findByDocument(
      '00000000000',
    );

    expect(customer).toBeNull();
  });

  it('should reject duplicated documents', async () => {
    const firstId = randomUUID();
    const secondId = randomUUID();
    createdIds.push(firstId);

    const data = {
      type: CustomerType.INDIVIDUAL,
      name: 'Maria Silva',
      document: '52998224725',
      email: 'maria@email.com',
      status: CustomerStatus.ACTIVE,
    };

    await repository.create({
      id: firstId,
      ...data,
    });

    await expect(
      repository.create({
        id: secondId,
        ...data,
      }),
    ).rejects.toMatchObject({
      driverError: { code: '23505' },
    });
  });
});
