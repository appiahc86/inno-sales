
import db  from "../dbConfig/db"
const OrderDetails = async () => {
    if (!await db.schema.hasTable('orderDetails')){

        await db.schema.createTable('orderDetails', table => {
            table.bigIncrements('id').primary();
            table.bigInteger('productId').unsigned();
            table.string('productName')
            table.integer('quantity', 7);
            table.float('buyingPrice');
            table.float('originalPrice');
            table.float('sellingPrice');
            table.float('total');
            table.float('tax');
            table.float('discount');
            table.date('date');
            table.bigInteger('categoryId').unsigned();
            table.bigInteger('orderId').unsigned().notNullable();

            table.foreign('orderId').references('id').inTable('orders').onDelete('CASCADE');
        })
    }

}

export default OrderDetails;