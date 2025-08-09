export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Esse email já está sendo usado');
  }
}
