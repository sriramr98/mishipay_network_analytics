import express from 'express';
import 'dotenv/config';

import validateQuery from './validator.js';
import { AnalyticsSchema, GetUserSchema } from './validator.js';
import { getUserInfo, getAnalytics } from './controllers.js';
import { asyncHandler, globalErrorHandler } from './utils.js';
import HttpException from './error.js';

const app = express();

app.get(
    '/analytics',
    validateQuery(AnalyticsSchema),
    asyncHandler(getAnalytics),
);
app.get(
    '/user/search',
    validateQuery(GetUserSchema),
    asyncHandler(getUserInfo),
);

app.all('*', (req, res, next) => {
    return next(new HttpException(500, `Path ${req.url} not found`));
});

app.use(globalErrorHandler);

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});
