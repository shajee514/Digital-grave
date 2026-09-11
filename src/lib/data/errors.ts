/**
 * Raised when the site is asked for live data it cannot produce yet,
 * because something has not been configured. The interface turns this into
 * a friendly "the cemetery is updating" message rather than showing the
 * raw technical error.
 */
export class NotConfiguredError extends Error {
  constructor(what: string) {
    super(`CONFIGURATION REQUIRED: ${what}`);
    this.name = 'NotConfiguredError';
  }
}

/** Raised when the blockchain itself cannot be reached or read. */
export class ChainUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChainUnavailableError';
  }
}
