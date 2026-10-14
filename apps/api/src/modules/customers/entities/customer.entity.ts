import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  CustomerType,
  CustomerStatus,
} from '../domain/customer';

@Entity({ name: 'customers' })
export class CustomerEntity {
    @PrimaryColumn('uuid')
    ID!: string;

    @Column({ type: 'varchar', length: 20 })
    TYPE!: CustomerType;

    @Column({ type: 'varchar', length: 150 })
    NAME!: string;

    @Column({ type: 'varchar', length: 14, unique: true })
    DOCUMENT!: string;

    @Column({ type: 'varchar', length: 255 })
    EMAIL!: string;

    @Column({ type: 'varchar', length: 20, default: CustomerStatus.ACTIVE })
    STATUS!: CustomerStatus;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
    })
    CREATED_AT!: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
    })
    UPDATED_AT!: Date;
}