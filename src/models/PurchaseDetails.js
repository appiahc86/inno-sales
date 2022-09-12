
import db  from "../dbConfig/db"
const PurchaseDetails = async () => {
    if (!await db.schema.hasTable('purchaseDetails')){

        await db.schema.createTable('purchaseDetails', table => {
            table.increments('id').primary();
            table.integer( 'purchaseId');
            table.string('productName');
            table.integer('quantity');
            table.integer('productId');
            table.float('cost');
            table.float('total');

            table.foreign('purchaseId').references('id').inTable('purchases').onDelete('CASCADE');

        })
    }

}

export default PurchaseDetails;