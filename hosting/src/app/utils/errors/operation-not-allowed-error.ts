export class OperationNotAllowedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OperationNotAllowedError';
  }
}
