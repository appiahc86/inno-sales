
import db  from "../dbConfig/db"
const PurchaseDetails = async () => {
    if (!await db.schema.hasTable('purchaseDetails')){

        await db.schema.createTable('purchaseDetails', table => {
            table.bigIncrements('id').primary();
            table.bigInteger( 'purchaseId');
            table.string('productName');
            table.integer('quantity');
            table.float('cost');
            table.float('total');

            table.foreign('purchaseId').references('id').inTable('purchases');

        })
    }

}

export default PurchaseDetails;