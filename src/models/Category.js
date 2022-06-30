
import db  from "../dbConfig/db"
const Category = async () => {

    if (!await db.schema.hasTable('categories')){

        await db.schema.createTable('categories', table => {
            table.bigIncrements('id').primary();
            table.string('name', 20).unique();
        })

    }

}

export default Category;



