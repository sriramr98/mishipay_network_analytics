import sql from './../db.js';

export default class AnalyticsService {
    static async getTopUsersByUsage(date, page, limit) {
        await sql`SET timezone TO 'UTC'`;
        const results = await sql`SELECT
                username,
                SUM(CASE WHEN start_time::date = ${date}::date - INTERVAL '1 DAY' THEN usage_time ELSE 0 END) AS lastDayUsage,
                SUM(CASE WHEN start_time::date >= ${date}::date - INTERVAL '7 DAYS' THEN usage_time ELSE 0 END) AS last7DayUsage,
                SUM(CASE WHEN start_time::date >= ${date}::date - INTERVAL '30 DAYS' THEN usage_time ELSE 0 END) AS last30DayUsage
            FROM network_usage
            WHERE start_time::date >= ${date}::date - INTERVAL '30 DAYS'
            GROUP BY username
            ORDER BY SUM(usage_time) DESC
            LIMIT ${limit} OFFSET ${limit} * (${page} - 1);`;

        const totalUsersResult =
            await sql`SELECT COUNT(DISTINCT username) AS totalusers
            FROM network_usage
            WHERE start_time::date >= ${date}::date - INTERVAL '30 DAYS';
        `;

        console.log(totalUsersResult[0]);
        const totalPages = Math.ceil(
            parseInt(totalUsersResult[0].totalusers) / limit,
        );
        console.log(totalPages);

        // The query gives an empty object if it there are no results
        if (!Array.isArray(results)) {
            return {
                totalPages: 0,
                results: [],
            };
        }

        return {
            totalPages,
            results,
        };
    }
}
