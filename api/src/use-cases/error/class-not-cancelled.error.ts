export class ClassNotCancelledError extends Error {
  constructor() {
    super('Class is not cancelled for this date');
  }
}
