import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomers1791986612943 implements MigrationInterface {
    name = 'CreateCustomers1791986612943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "customers" (
                "ID" uuid NOT NULL,
                "TYPE" character varying(20) NOT NULL,
                "NAME" character varying(150) NOT NULL,
                "DOCUMENT" character varying(14) NOT NULL,
                "EMAIL" character varying(255) NOT NULL,
                "STATUS" character varying(20) NOT NULL DEFAULT 'ACTIVE',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_b3cc10c4a54e24c175d02165da3" UNIQUE ("DOCUMENT"),
                CONSTRAINT "PK_68750397c8ad141a522b1a4adb5" PRIMARY KEY ("ID")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "customers"
        `);
    }

}
