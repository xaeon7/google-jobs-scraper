import { CustomError, CustomErrorType } from "./custom-error";
export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string, public field?: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): CustomErrorType[] {
    return [{ message: this.message, field: this.field }];
  }
}
