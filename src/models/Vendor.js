
import db  from "../dbConfig/db"
const Vendor = async () => {
    if (!await db.schema.hasTable('vendors')){

        await db.schema.createTable('vendors', table => {
            table.bigIncrements('id').primary();
            table.string('firstName', 40);
            table.string('lastName', 40);
            table.string('email', 40);
            table.string('address');
            table.string('contact', 40);
            table.string('accountNumber', 40);
        })
    }
}

export default Vendor;