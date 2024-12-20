import HttpException from './error.js';

export const asyncHandler = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};

export const globalErrorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof HttpException) {
        return res.status(err.getStatusCode()).json(err.getErrResponse());
    }

    return res.status(500).json({
        ok: false,
        message: 'Something went wrong',
    });
};
