
import db  from "../dbConfig/db"
const PriceAdjustment = async () => {

    if (!await db.schema.hasTable('priceAdjustments')){

        await db.schema.createTable('priceAdjustments', table => {
            table.increments('id').primary();
            table.integer('userId').notNullable();
            table.date('date').index().defaultTo(db.fn.now());
            table.integer('productId').unsigned();
            table.float('oldCost');
            table.float('newCost');
            table.float('oldPrice');
            table.float('newPrice');
            table.string('productName');
            table.string('reason');

            table.foreign('productId').references('id').inTable('products').onDelete('CASCADE');
        })

    }

}

export default PriceAdjustment;