
import db  from "../dbConfig/db"
const Purchase = async () => {
    if (!await db.schema.hasTable('purchases')){

        await db.schema.createTable('purchases', table => {
            table.bigIncrements('id').primary();
            table.date()

        })
    }

}

export default Purchase;