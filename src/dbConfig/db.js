
import knex from "knex";
const db = knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        // filename: './bk/sales.sqlite3'
        filename: './bk/sales.db'
    }
 })


export default db;