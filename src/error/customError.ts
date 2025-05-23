import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { HttpException } from './HttpException';

export class NotFoundError extends Error {
    status: number;

    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.status = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class BadRequestError extends HttpException {
    constructor(message: string) {
        super(StatusCodes.BAD_REQUEST, message);
        this.name = ReasonPhrases.BAD_REQUEST;
    }
}

export class DuplicateError extends HttpException {
    constructor(message: string) {
        super(StatusCodes.CONFLICT, message);
        this.name = ReasonPhrases.CONFLICT;
    }
}

export class UnAuthenticatedError extends HttpException {
    constructor(message: string) {
        super(StatusCodes.UNAUTHORIZED, message);
        this.name = ReasonPhrases.UNAUTHORIZED;
    }
}

export class UnAuthorizedError extends HttpException {
    constructor(message: string) {
        super(StatusCodes.FORBIDDEN, message);
        this.name = ReasonPhrases.FORBIDDEN;
    }
}

export class NotAcceptableError extends HttpException {
    constructor(message: string) {
        super(StatusCodes.NOT_ACCEPTABLE, message);
        this.name = ReasonPhrases.NOT_ACCEPTABLE;
    }
}
