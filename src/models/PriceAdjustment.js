
import db  from "../dbConfig/db"
const PriceAdjustment = async () => {

    if (!await db.schema.hasTable('priceAdjustments')){

        await db.schema.createTable('priceAdjustments', table => {
            table.increments('id').primary();
            table.integer('userId').notNullable();
            table.date('date').defaultTo(db.fn.now());
            table.integer('productId');
            table.float('oldCost');
            table.float('newCost');
            table.float('oldPrice');
            table.float('newPrice');
            table.string('productName');
            table.string('reason');
        })

    }

}

export default PriceAdjustment;