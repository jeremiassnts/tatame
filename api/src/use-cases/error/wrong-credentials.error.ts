export class WrongCredentialsError extends Error {
  constructor() {
    super('Credenciais inválidas');
  }
}
