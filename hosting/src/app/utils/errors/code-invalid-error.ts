export class CodeInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CodeInvalidError';
  }
}
