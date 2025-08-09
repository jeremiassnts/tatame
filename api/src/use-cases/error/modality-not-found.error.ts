export class ModalityNotFoundError extends Error {
  constructor() {
    super('Modalidade não encontrada');
  }
}
