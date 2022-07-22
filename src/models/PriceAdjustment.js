
import db  from "../dbConfig/db"
const PriceAdjustment = async () => {

    if (!await db.schema.hasTable('priceAdjustments')){

        await db.schema.createTable('priceAdjustments', table => {
            table.bigIncrements('id').primary();
            table.bigInteger('userId').notNullable();
            table.date('date');
            table.bigInteger('productId');
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