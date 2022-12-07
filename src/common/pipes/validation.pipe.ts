import { ErrorException } from './../exceptions/error.exception';
import { ConfigCore } from '../../shared/types/config.type';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AppUtils } from '../utils/app.utils';
import { ERROR_CODES } from '../constants/error.constant';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform<T>(value: T, { metatype }: ArgumentMetadata): Promise<T> {
    if (value === null || !value) {
      value = Object.assign({}, value);
    }

    if (!metatype || !ValidationPipe.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length === 0) {
      return value;
    }

    //- Top-level errors
    const topLevelErrors: ValidationErrorDto[] = errors
      //- Top-level errors have the constraints here
      .filter((v) => v.constraints)
      .map((error) => ({
        property: error.property,
        constraints: Object.values(error.constraints as any),
      }));

    //- Nested errors
    const nestedErrors: ValidationErrorDto[] = [];
    errors
      //- Nested errors do not have constraints here
      .filter((v) => !v.constraints)
      .forEach((error) => {
        const validationErrors = this.getValidationErrorsFromChildren(
          error.property,
          error.children,
        );
        nestedErrors.push(...validationErrors);
      });

    const validationErrors = topLevelErrors.concat(nestedErrors);
    const errorProperties = validationErrors.map((e) => e.property).join(',');

    throw new ErrorException({
      code: ERROR_CODES.HTTP_UNPROCESSABLE_ENTITY,
      errors: validationErrors,
      message: `Validation errors with properties [${errorProperties}]`,
    });
  }

  private static toValidate(metatype: any): boolean {
    const types: Array<() => any> = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }

  private getValidationErrorsFromChildren(
    parent: string,
    children: ValidationError[],
    errors: ValidationErrorDto[] = [],
  ): ValidationErrorDto[] {
    children.forEach((child) => {
      if (child.constraints) {
        errors.push({
          property: `${parent}.${child.property}`,
          constraints: Object.values(child.constraints),
        });
      } else {
        return this.getValidationErrorsFromChildren(
          `${parent}.${child.property}`,
          child.children,
          errors,
        );
      }
    });

    return errors;
  }
}

interface ValidationErrorDto {
  property: string;
  constraints: string[];
}
