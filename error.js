export default class HttpException extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }

    getErrResponse() {
        return {
            ok: false,
            message: this.message,
        };
    }

    getStatusCode() {
        return this.statusCode;
    }
}
