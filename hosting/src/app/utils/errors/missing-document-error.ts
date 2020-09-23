export class MissingDocumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MissingDocumentError';
  }
}
