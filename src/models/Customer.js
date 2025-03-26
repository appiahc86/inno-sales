
import db  from "../dbConfig/db"
const Customer = async () => {
    if (!await db.schema.hasTable('customers')){

        await db.schema.createTable('customers', table => {
            table.increments('id').primary();
            table.string('name', 40);
            table.string('company', 60);
            table.double('account').defaultTo(0);
            table.string('phone', 36);
            table.string('address', 100);
            table.boolean('isActive').defaultTo(true)
        })


        //insert Cash sale customer
        await db('customers').insert({ name: 'Cash Customer'});


    }

}

export default Customer;