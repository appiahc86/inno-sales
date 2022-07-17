
import db  from "../dbConfig/db"
const Order = async () => {
    if (!await db.schema.hasTable('orders')){

        await db.schema.createTable('orders', table => {
            table.bigIncrements('id').primary();
            table.date('orderDate').defaultTo(db.fn.now());
            table.integer('numberOfItems', 7);
            table.float('momo');
            table.float('total');
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