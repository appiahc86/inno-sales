
import db  from "../dbConfig/db"
const Order = async () => {
    if (!await db.schema.hasTable('orders')){

        await db.schema.createTable('orders', table => {
            table.increments('id').primary();
            table.date('orderDate').index().defaultTo(db.fn.now());
            table.enum('type', ['sale', 'return']).defaultTo('sale');
            table.enum('saleType', ['cash', 'credit']).defaultTo('cash').index();
            table.integer('numberOfItems');
            table.float('momo');
            table.string('momoType').defaultTo('');
            table.decimal('total');
            table.float('tendered');
            table.float('discount');
            table.float('tax');
            table.string('invoiceNumber').unique();
            table.boolean('isPaid').defaultTo(true).index();
            table.json('payments').defaultTo('{}')
            table.integer('customerId').unsigned();
            table.integer('userId').unsigned();

            table.foreign('userId').references('id').inTable('users');
            table.foreign('customerId').references('id').inTable('customers');
        })


    }

}

export default Order;