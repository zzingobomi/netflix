import { CreateMovieDto } from './create-movie.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}

// Custom Validator
// @ValidatorConstraint()
// class PasswordValidator implements ValidatorConstraintInterface {
//   validate(
//     value: any,
//     validationArguments?: ValidationArguments,
//   ): Promise<boolean> | boolean {
//     return value.length > 4 && value.length < 8;
//   }
//   defaultMessage(validationArguments?: ValidationArguments): string {
//     return '비밀번호의 길이는 4~8자 여야합니다. 입력된 비밀번호: ($value)';
//   }
// }

// function IsPasswordValid(validationOptions?: ValidationOptions) {
//   return function (object: object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName,
//       options: validationOptions,
//       validator: PasswordValidator,
//     });
//   };
// }

// export class updateMovieDto {
//   @IsNotEmpty()
//   @IsString()
//   @IsOptional()
//   title?: string;

//   @IsArray()
//   @ArrayNotEmpty()
//   @IsNumber({}, { each: true })
//   @IsOptional()
//   genreIds?: number[];

//   // @IsPasswordValid()
//   // test: string;

//   @IsNotEmpty()
//   @IsOptional()
//   detail?: string;

//   @IsNotEmpty()
//   @IsNumber()
//   @IsOptional()
//   directorId?: number;
// }
