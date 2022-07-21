
import db  from "../dbConfig/db"
const Purchase = async () => {
    if (!await db.schema.hasTable('purchases')){

        await db.schema.createTable('purchases', table => {
            table.bigIncrements('id').primary();
            table.date('billDate');
            table.date('invoiceDue');
            table.bigInteger( 'vendorId');
            table.enum('status', ['received', 'returned']).defaultTo('received')
            table.integer('numberOfItems');
            table.date('returnedDate');
            table.string('invoice');
            table.float('total');

            table.foreign('vendorId').references('id').inTable('vendors');

        })
    }

}

export default Purchase;