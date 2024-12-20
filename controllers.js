import { isFuture, format, parse, isValid } from 'date-fns';
import HttpException from './error.js';
import AnalyticsService from './services/analytics.js';
import { convertSecondsToReadableFormat } from './utils/analytics.js';

export const getAnalytics = async (req, res) => {
    const { date, page = '1', limit = '100' } = req.query;

    let formattedDate = parse(date, 'ddMMyyyy', new Date());
    if (isFuture(formattedDate) || !isValid(formattedDate)) {
        throw new HttpException(422, 'invalid date');
    }

    // convert date to string for sql query
    formattedDate = format(formattedDate, 'yyyy-MM-dd');
    console.log({ formattedDate });

    const response = await AnalyticsService.getTopUsersByUsage(
        formattedDate,
        page,
        limit,
    );

    if (response.results.length === 0) {
        return res.json({
            ok: true,
            data: [],
        });
    }

    return res.json({
        ok: true,
        data: convertSecondsToReadableFormat(response.results),
        pageSize: parseInt(limit),
        page: parseInt(page),
        totalPages: response.totalPages,
    });
};

export const getUserInfo = async (req, res) => {
    res.send('get users');
};
