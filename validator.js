import Joi from 'joi';

export const AnalyticsSchema = Joi.object({
    date: Joi.string().length(8).required(),
    limit: Joi.number(),
    page: Joi.number(),
});

export const GetUserSchema = Joi.object({
    username: Joi.string().required(),
    datetime: Joi.date().timestamp(),
});

const validateQuery = (schema) => (req, res, next) => {
    try {
        const result = schema.validate(req.query);
        if (result.error) {
            return res.status(400).json({ error: result.error.details });
        }
        next();
    } catch (e) {
        return res
            .status(400)
            .json({ error: [{ message: 'Unable to validate request' }] });
    }
};

export default validateQuery;
