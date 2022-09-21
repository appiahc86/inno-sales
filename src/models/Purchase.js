
import db  from "../dbConfig/db"
const Purchase = async () => {
    if (!await db.schema.hasTable('purchases')){

        await db.schema.createTable('purchases', table => {
            table.increments('id').primary();
            table.integer('userId');
            table.date('billDate').index();
            table.date('invoiceDue');
            table.integer( 'vendorId');
            table.integer('numberOfItems');
            table.string('invoice');
            table.float('total');

            table.foreign('vendorId').references('id').inTable('vendors');

        })
    }

}

export default Purchase;