
import db  from "../dbConfig/db";

const Product = async () => {
    if (!await db.schema.hasTable('products')){

        await db.schema.createTable('products', table => {
            table.increments('id').primary();
            table.string('productName', 100).notNullable();
            table.string('description', 100).nullable();
            table.integer('quantity').notNullable();
            table.integer('warehouseQty').notNullable().defaultTo(0);
            table.float('buyingPrice').notNullable().defaultTo(0.00);
            table.float('sellingPrice').notNullable();
            table.float('wholesalePrice').defaultTo(0.00);
            table.string('tax', 6).notNullable();
            table.date('dateAdded').defaultTo(db.fn.now());
            table.date('expiration');
            table.integer('category').unsigned().notNullable();

            table.foreign('category').references('id').inTable('categories');
        })
    }else {
        // Check if wholesalePrice column exists, if not add it
        const hasColumn = await db.schema.hasColumn('products', 'wholesalePrice');

        if (!hasColumn) {
            await db.schema.alterTable('products', table => {
                table.float('wholesalePrice').defaultTo(0.00);
            });
        }
    }
}

export default Product;