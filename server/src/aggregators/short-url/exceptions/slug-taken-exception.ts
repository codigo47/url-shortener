export class SlugTakenException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SlugTakenException';
  }
}
