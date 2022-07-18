
import db  from "../dbConfig/db";

const Product = async () => {
    if (!await db.schema.hasTable('products')){

        await db.schema.createTable('products', table => {
            table.bigIncrements('id').primary();
            table.string('productName', 100).notNullable();
            table.string('description', 100).nullable();
            table.integer('quantity').notNullable();
            table.float('buyingPrice');
            table.float('sellingPrice').notNullable();
            table.string('tax', 6).notNullable();
            table.date('dateAdded');

            table.bigInteger('category').unsigned().notNullable();
            table.foreign('category').references('id').inTable('categories');
        })
    }
}

export default Product;