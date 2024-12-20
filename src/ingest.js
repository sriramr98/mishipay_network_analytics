import 'dotenv/config';

import fs from 'fs';
import csv from 'csv-parser';

import sql from '../db.js';

const SECONDS_IN_AN_HOUR = 3600;
const SECONDS_IN_A_MINUTE = 60;

const insertBatch = async (sql, batch) => {
    await sql`SET timezone TO 'UTC';`;
    return await sql`INSERT INTO network_usage ${sql(batch, 'username', 'mac_address', 'start_time', 'usage_time', 'upload', 'download')}`;
};

const dropAndCreateTable = async (sql) => {
    await sql`SET timezone TO 'UTC';`;

    await sql`DROP TABLE IF EXISTS network_usage;`;
    return sql`
    CREATE TABLE network_usage (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        mac_address VARCHAR(17) NOT NULL CHECK (mac_address ~ '^[0-9A-Fa-f]{2}(:[0-9A-Fa-f]{2}){5}$'),
        start_time TIMESTAMP NOT NULL,
        usage_time INT NOT NULL,
        upload NUMERIC NOT NULL,
        download NUMERIC NOT NULL
    );`;
};

const timeToSeconds = (input) => {
    // input format hours:minutes:seconds
    const [hours, minutes, seconds] = input.split(':');
    return (
        parseInt(hours) * SECONDS_IN_AN_HOUR +
        parseInt(minutes) * SECONDS_IN_A_MINUTE +
        parseInt(seconds)
    );
};

!(async () => {
    const filePath = process.env.IMPORT_FILE_PATH || 'data.csv';

    const parser = fs.createReadStream(filePath).pipe(csv());

    let batch = [];
    let processedRows = 0;
    const batchSize = 500;
    let totalRowsProcessed = 0;
    let batchNo = 1;

    await sql.begin(async (sql) => {
        await dropAndCreateTable(sql);
        for await (const record of parser) {
            record.start_time = new Date(record.start_time);
            record.usage_time = timeToSeconds(record.usage_time);
            record.upload = parseFloat(record.upload);
            record.download = parseFloat(record.download);

            batch.push(record);
            processedRows++;
            totalRowsProcessed++;

            if (processedRows === batchSize) {
                console.log(`Inserting batch ${batchNo}`);
                await insertBatch(sql, batch);
                processedRows = 0;
                batch = [];
                batchNo++;
            }
        }

        if (processedRows > 0) {
            await insertBatch(sql, batch);
        }
    });

    process.exit(0);
})();
