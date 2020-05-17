module.exports = class ExistingEmailError extends Error {
  constructor(message) {
    super(message);

    this.status = 400;
    delete this.stack;
  }
};

module.exports = class UnauthorizedError extends Error {
  constructor(message) {
    super(message);

    this.status = 401;
    delete this.stack;
  }
};

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);

    this.status = 404;
    delete this.stack;
  }
};
