
import db  from "../dbConfig/db"
const Order = async () => {
    if (!await db.schema.hasTable('orders')){

        await db.schema.createTable('orders', table => {
            table.bigIncrements('id').primary();
            table.date('orderDate');
            table.enum('type', ['sale', 'return']).defaultTo('sale');
            table.integer('numberOfItems');
            table.float('momo');
            table.decimal('total');
            table.float('tendered');
            table.float('discount');
            table.float('tax');
            table.bigInteger('customerId').unsigned();
            table.bigInteger('userId').unsigned();

            table.foreign('userId').references('id').inTable('users');
        })
    }

}

export default Order;