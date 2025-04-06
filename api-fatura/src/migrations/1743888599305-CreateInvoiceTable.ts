import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInvoiceTable1712358400533 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'invoice',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'clientNumber',
          type: 'varchar',
        },
        {
          name: 'referenceMonth',
          type: 'varchar',
        },
        {
          name: 'energiaEletricaKwh',
          type: 'decimal',
        },
        {
          name: 'energiaEletricaReais',
          type: 'decimal',
        },
        {
          name: 'energiaSCEEEKwh',
          type: 'decimal',
        },
        {
          name: 'energiaSCEEReais',
          type: 'decimal',
        },
        {
          name: 'energiaCompensadaKwh',
          type: 'decimal',
        },
        {
          name: 'energiaCompensadaReais',
          type: 'decimal',
        },
        {
          name: 'contribuicaoIlumReais',
          type: 'decimal',
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoice');
  }
}
