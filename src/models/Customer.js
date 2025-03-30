
import db  from "../dbConfig/db"
const Customer = async () => {
    if (!await db.schema.hasTable('customers')){

        await db.schema.createTable('customers', table => {
            table.increments('id').primary();
            table.string('name');
            table.string('company');
            table.double('account').defaultTo(0);
            table.string('phone');
            table.string('address');
            table.boolean('isActive').defaultTo(true)
        })


        //insert Cash sale customer
        await db('customers').insert({ name: 'Cash Customer'});


    }

}

export default Customer;