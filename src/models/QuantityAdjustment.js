
import db  from "../dbConfig/db"
const QuantityAdjustment = async () => {

    if (!await db.schema.hasTable('quantityAdjustments')){

        await db.schema.createTable('quantityAdjustments', table => {
            table.increments('id').primary();
            table.integer('userId').notNullable();
            table.integer('productId').unsigned();
            table.date('date').index().defaultTo(db.fn.now());
            table.integer('oldQuantity');
            table.integer('quantity');
            table.enum('type', ['increment', 'decrement']);
            table.string('productName');
            table.string('reason');

            table.foreign('productId').references('id').inTable('products').onDelete('CASCADE');
        })

    }

}

export default QuantityAdjustment;