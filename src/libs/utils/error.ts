export class ValidationError extends Error {
  issues: string[] | null;

  constructor(issues: string[] | null) {
    super('Validation error.');
    this.issues = issues || null;
  }
}

export class AuthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}
