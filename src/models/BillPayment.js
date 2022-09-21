
import db  from "../dbConfig/db"
const BillPayment = async () => {

    if (!await db.schema.hasTable('billPayments')){

        await db.schema.createTable('billPayments', table => {
            table.increments('id').primary();
            table.integer('purchaseId').notNullable().index();
            table.date('date').notNullable();
            table.float('amount');
            table.string('note');
            table.foreign('purchaseId').references('id').inTable('purchases').onDelete('CASCADE');
        })

    }

}

export default BillPayment;



