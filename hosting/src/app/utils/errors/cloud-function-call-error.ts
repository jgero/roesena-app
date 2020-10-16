export class CloudFunctionCallError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CloudFunctionCallError';
  }
}
