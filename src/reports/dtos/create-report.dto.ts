import {
  IsIn,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsIn(['low', 'medium', 'high'])//evitamos que alguien mande un valor que no sea low, medium o high
  severity!: string;

  @IsString()
  @IsNotEmpty()
  reporterPhone!: string;
}