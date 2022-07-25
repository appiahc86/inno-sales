
import db  from "../dbConfig/db"
const User = async () => {
    if (!await db.schema.hasTable('users')){

        await db.schema.createTable('users', table => {
            table.bigIncrements('id').primary();
            table.string('firstName', 20).notNullable();
            table.string('lastName', 20);
            table.string('username', 20);
            table.string('password').notNullable();
            table.tinyint('role', 1).notNullable();
            table.boolean('isActive').defaultTo(true);
            table.boolean('resetPassword').defaultTo(true);
        })

    }

}

export default User;