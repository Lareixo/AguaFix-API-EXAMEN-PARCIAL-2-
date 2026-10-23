import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhotoUrlToWaterReport1788662231825 implements MigrationInterface {
  name = 'AddPhotoUrlToWaterReport1788662231825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "WATER_REPORT" ADD "photoUrl" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "WATER_REPORT" ALTER COLUMN "photoUrl" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "WATER_REPORT" ADD "repairPhotoUrl" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "WATER_REPORT" DROP COLUMN "repairPhotoUrl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WATER_REPORT" DROP COLUMN "photoUrl"`,
    );
  }
}
