export class ValidationError extends Error {
  issues: string[] | null;

  constructor(issues: string[] | null) {
    super('validation error');
    this.issues = issues || null;
  }
}
