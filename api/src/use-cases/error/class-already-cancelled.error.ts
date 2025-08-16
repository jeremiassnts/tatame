export class ClassAlreadyCancelledError extends Error {
  constructor() {
    super('Class is already cancelled for this date');
  }
}
