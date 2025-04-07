import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFilenameToInvoices implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" ADD "filename" varchar`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "filename"`);
  }
}
