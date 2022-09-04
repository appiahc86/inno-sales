
import db  from "../dbConfig/db"
const User = async () => {
    if (!await db.schema.hasTable('users')){

        await db.schema.createTable('users', table => {
            table.bigIncrements('id').primary();
            table.date('dateAdded').defaultTo(db.fn.now());
            table.string('firstName', 20).notNullable();
            table.string('lastName', 20);
            table.string('username', 20).unique();
            table.string('phone', 22);
            table.string('password').notNullable();
            table.tinyint('role', 1).notNullable();
            table.boolean('isActive').defaultTo(true);
            table.boolean('resetPassword').defaultTo(true);
            table.boolean('runSalesReport').defaultTo(true);
            table.boolean('giveDiscount').defaultTo(true);
            table.boolean('changePrice').defaultTo(true);
        });

        //insert User if none exists
        await db('users').insert(
            {
                firstName: "Admin", lastName: "Admin",username: "admin",
                password: "$2a$10$N9sVJn6Nwxtm.PUmbRXLzOFNZfRAjTjNK3EfFu2qRjpnNHQrCbd6i", //@LogMeIn
                role: 1
            }
        );

    }



}

export default User;