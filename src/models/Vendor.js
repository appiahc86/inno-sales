
import db  from "../dbConfig/db"
const Vendor = async () => {
    if (!await db.schema.hasTable('vendors')){

        await db.schema.createTable('vendors', table => {
            table.increments('id').primary();
            table.string('company', 150);
            table.string('address', 100);
            table.string('contactPerson', 50);
            table.string('phone', 50);
            table.boolean('isActive').defaultTo(true)
            table.string('accountNumber', 50);
            table.string('notes');
        })
    }
}

export default Vendor;