import { Pool } from "pg";

const poolDB = new Pool({
    user: "postgres",
    host: "localhost",
    database: "expense_tracker",
    password: "040907",
    port: 5432,
})

export default poolDB;
