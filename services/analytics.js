import { NotFoundException } from '../error.js';
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

    static async get24HourUserUsage(username, date) {
        const userCheckResults =
            await sql`SELECT 1 as exists FROM network_usage WHERE username = ${username} LIMIT 1`;
        if (userCheckResults.length === 0) {
            throw new NotFoundException('user not found');
        }

        await sql`SET timezone to 'UTC'`;
        const results = await sql`
            WITH cte_last_hour AS (
                SELECT 
                    username,
                    SUM(usage_time) AS total_usage_time,
                    SUM(upload) AS total_upload,
                    SUM(download) AS total_download
                FROM network_usage
                WHERE username = ${username}
                AND start_time >= (${date}::timestamp - INTERVAL '1 hour') 
                AND start_time < ${date}::timestamp
                GROUP BY username
            ),
            cte_last_6_hours AS (
                SELECT 
                    username,
                    SUM(usage_time) AS total_usage_time,
                    SUM(upload) AS total_upload,
                    SUM(download) AS total_download
                FROM network_usage
                WHERE username = ${username} 
                AND start_time >= (${date}::timestamp - INTERVAL '6 hours') 
                AND start_time < ${date}::timestamp
                GROUP BY username
            ),
            cte_last_24_hours AS (
                SELECT 
                    username,
                    SUM(usage_time) AS total_usage_time,
                    SUM(upload) AS total_upload,
                    SUM(download) AS total_download
                FROM network_usage
                WHERE username = ${username} 
                AND start_time >= (${date}::timestamp - INTERVAL '24 hours') 
                AND start_time < ${date}::timestamp
                GROUP BY username
            )
            SELECT 
                ${username} AS username,
                JSON_BUILD_OBJECT(
                    'time', COALESCE(lh.total_usage_time, 0),
                    'upload', COALESCE(lh.total_upload, 0),
                    'download', COALESCE(lh.total_download, 0)
                ) AS lastHourUsage,
                JSON_BUILD_OBJECT(
                    'time', COALESCE(l6h.total_usage_time, 0),
                    'upload', COALESCE(l6h.total_upload, 0),
                    'download', COALESCE(l6h.total_download, 0) 
                ) AS last6HourUsage,
                JSON_BUILD_OBJECT(
                    'time', COALESCE(l24h.total_usage_time, 0),
                    'upload', COALESCE(l24h.total_upload, 0),
                    'download', COALESCE(l24h.total_download, 0)
                ) AS last24HourUsage
            FROM cte_last_hour lh
            LEFT JOIN cte_last_6_hours l6h ON lh.username = l6h.username
            LEFT JOIN cte_last_24_hours l24h ON lh.username = l24h.username
            LIMIT 1;
        `;

        return results[0];
    }
}
