
import db  from "../dbConfig/db"
const QuantityAdjustment = async () => {

    if (!await db.schema.hasTable('quantityAdjustments')){

        await db.schema.createTable('quantityAdjustments', table => {
            table.increments('id').primary();
            table.integer('userId').notNullable();
            table.integer('productId');
            table.date('date').defaultTo(db.fn.now());
            table.integer('oldQuantity');
            table.integer('quantity');
            table.enum('type', ['increment', 'decrement']);
            table.string('productName');
            table.string('reason');
        })

    }

}

export default QuantityAdjustment;