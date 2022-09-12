
import db  from "../dbConfig/db"
const OrderDetails = async () => {
    if (!await db.schema.hasTable('orderDetails')){

        await db.schema.createTable('orderDetails', table => {
            table.increments('id').primary();
            table.integer('productId').unsigned();
            table.string('productName');
            table.integer('quantity', 7);
            table.float('buyingPrice');
            table.float('originalPrice');
            table.float('sellingPrice');
            table.float('total');
            table.float('tax');
            table.float('discount');
            table.date('date').defaultTo(db.fn.now());
            table.integer('categoryId').unsigned();
            table.integer('orderId').unsigned().notNullable();

            table.foreign('orderId').references('id').inTable('orders').onDelete('CASCADE');
            table.foreign('categoryId').references('id').inTable('categories')
        })
    }

}

export default OrderDetails;