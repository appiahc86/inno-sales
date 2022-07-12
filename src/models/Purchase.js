
import db  from "../dbConfig/db"
const Purchase = async () => {
    if (!await db.schema.hasTable('purchases')){

        await db.schema.createTable('purchases', table => {
            table.bigIncrements('id').primary();
            table.date('billDate');
            table.date('invoiceDue');
            table.bigInteger( 'vendorId');
            table.integer('numberOfItems');
            table.string('invoice');
            table.float('total');
            table.float('payment');

            table.foreign('vendorId').references('id').inTable('vendors');

        })
    }

}

export default Purchase;