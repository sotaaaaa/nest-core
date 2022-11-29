import { ERROR_CODES } from './../../common/constants/error.constant';

export type ErrorResponse = {
  code: ERROR_CODES;
  message?: string;
  errors?: Record<string, any>[];
};
