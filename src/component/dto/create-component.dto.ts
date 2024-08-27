import { IsString, IsOptional } from 'class-validator';
export class CreateComponentDto {
@IsString()
    readonly name: string;

    @IsString()
    readonly type: string;

    @IsOptional()
    readonly properties?: any;

  }
