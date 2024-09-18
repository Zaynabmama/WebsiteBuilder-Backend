import { IsString, IsOptional, ValidateNested } from 'class-validator';


export class CreateComponentDto {
  @IsString()
  readonly type: string;


  @IsOptional()
  
  readonly properties: any;

  
}

