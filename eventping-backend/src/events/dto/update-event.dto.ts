import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateEventDto {
    @IsOptional()
    title?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    @IsDateString()
    date?: string;
}