import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as mustache from 'mustache';

import { INestApplication, HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from '../constants/error.constant';

export class AppUtils {
  // Tuỳ từng môi trường có thể set lại timeout
  public static killAppWithGrace = (app: INestApplication) => {
    process.on('SIGINT', async () => {
      setTimeout(() => process.exit(1), 1000);
      await app.close();
      process.exit(0);
    });

    // Kill -15
    process.on('SIGTERM', async () => {
      setTimeout(() => process.exit(1), 1000);
      await app.close();
      process.exit(0);
    });
  };

  /**
   * Chuuyển file yaml về định dạng JSON
   * @param path
   * @returns
   */
  public static loadFile<T = any>(path: string) {
    const raw = fs.readFileSync(path, 'utf8');
    const custom = mustache.render(raw, process.env, {}, ['${', '}']);
    const data = yaml.load(custom);

    return data as T;
  }

  /**
   * Mapping exception error code to application error code
   * @param statusCode
   * @returns
   */
  public static mappingErrorCode(statusCode: number | string): ERROR_CODES {
    switch (statusCode) {
      //- Http status code
      case HttpStatus.REQUEST_TIMEOUT:
        return ERROR_CODES.HTTP_REQUEST_TIMEOUT;
      case HttpStatus.BAD_REQUEST:
        return ERROR_CODES.HTTP_BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return ERROR_CODES.HTTP_UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ERROR_CODES.HTTP_FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ERROR_CODES.HTTP_NOT_FOUND;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return ERROR_CODES.HTTP_UNPROCESSABLE_ENTITY;
      case HttpStatus.TOO_MANY_REQUESTS:
        return ERROR_CODES.HTTP_TOO_MANY_REQUESTS;
      case HttpStatus.BAD_GATEWAY:
        return ERROR_CODES.HTTP_BAD_GATEWAY;
      case HttpStatus.GATEWAY_TIMEOUT:
        return ERROR_CODES.HTTP_GATEWAY_TIMEOUT;
      case HttpStatus.SERVICE_UNAVAILABLE:
        return ERROR_CODES.HTTP_SERVICE_UNAVAILABLE;

      //- Không mapping được code sẽ trả về server error
      default:
        return ERROR_CODES.HTTP_SERVER_ERROR;
    }
  }
}
