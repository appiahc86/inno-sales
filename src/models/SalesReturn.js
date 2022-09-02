
import db  from "../dbConfig/db"
const SalesReturn = async () => {
    if (!await db.schema.hasTable('salesReturns')){

        await db.schema.createTable('salesReturns', table => {
            table.bigIncrements('id').primary();
            table.bigInteger('userId').unsigned();
            table.bigInteger('productId').unsigned();
            table.string('productName')
            table.integer('quantity', 7);
            table.float('buyingPrice');
            table.float('originalPrice');
            table.float('sellingPrice');
            table.float('total');
            table.float('tax');
            table.float('discount');
            table.date('date').defaultTo(db.fn.now());
            table.bigInteger('categoryId').unsigned();
            table.bigInteger('orderId').unsigned().notNullable();

            table.foreign('orderId').references('id').inTable('orders').onDelete('CASCADE');
            table.foreign('categoryId').references('id').inTable('categories');
        })
    }

}

export default SalesReturn;