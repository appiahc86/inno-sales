
import db  from "../dbConfig/db"
const QuantityAdjustment = async () => {

    if (!await db.schema.hasTable('quantityAdjustments')){

        await db.schema.createTable('quantityAdjustments', table => {
            table.bigIncrements('id').primary();
            table.bigInteger('userId').notNullable();
            table.bigInteger('productId');
            table.date('date');
            table.integer('oldQuantity');
            table.integer('newQuantity');
            table.string('productName');
            table.string('reason');
        })

    }

}

export default QuantityAdjustment;