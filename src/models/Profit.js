
import db  from "../dbConfig/db"
const Profit = async () => {
    if (!await db.schema.hasTable('profits')){

        await db.schema.createTable('profits', table => {
            table.increments('id').primary();
            table.date('date').index();
            table.integer('orderId').unsigned().notNullable();
            table.float('profit').defaultTo(0)

            table.foreign('orderId').references('id').inTable('orders').onDelete('CASCADE');
        })

    }

}

export default Profit;