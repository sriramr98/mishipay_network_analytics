import postgres from 'postgres';

const config = {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    pass: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DB,
    ssl: true,
    debug: true,
};

const sql = postgres(config);

export default sql;
