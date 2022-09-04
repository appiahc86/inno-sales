
import db  from "../dbConfig/db"
const Settings = async () => {
    if (!await db.schema.hasTable('settings')){

        await db.schema.createTable('settings', table => {
            table.increments('id').primary();
            table.string('companyName', 60).nullable();
            table.string('storeName', 60).nullable();
            table.string('address', 60).nullable();
            table.string('contact', 60).nullable();
            table.float('tax', 2).defaultTo(0);
        });


        //insert company details
        await db('settings').insert({ companyName: '', storeName: '', address: '', contact: '', tax: 0 });

    }



}

export default Settings;