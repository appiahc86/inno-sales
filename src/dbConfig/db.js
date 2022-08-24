
import knex from "knex";

const db = knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './bk/sales.db'
    }
 })


export default db;