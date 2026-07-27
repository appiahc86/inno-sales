
import db from "../dbConfig/db"

// Columns that are joined/filtered on frequently but weren't indexed when their
// table was first created. Table creation only runs `CREATE TABLE IF NOT EXISTS`,
// so on an existing database new `.index()` calls in the schema builder never take
// effect — these run explicitly, every boot, via `IF NOT EXISTS` so they safely
// backfill indices on existing production databases without touching table data.
const indices = [
    ['idx_orderDetails_orderId', 'orderDetails', 'orderId'],
    ['idx_orderDetails_categoryId', 'orderDetails', 'categoryId'],
    ['idx_orderDetails_productId', 'orderDetails', 'productId'],
    ['idx_orderDetails_date', 'orderDetails', 'date'],
    ['idx_products_category', 'products', 'category'],
    ['idx_products_expiration', 'products', 'expiration'],
    ['idx_products_quantity', 'products', 'quantity'],
    ['idx_products_productName', 'products', 'productName'],
    ['idx_orders_customerId', 'orders', 'customerId'],
    ['idx_orders_userId', 'orders', 'userId'],
    ['idx_orders_orderDate', 'orders', 'orderDate'],
    ['idx_purchases_vendorId', 'purchases', 'vendorId'],
    ['idx_purchases_billDate', 'purchases', 'billDate'],
    ['idx_billPayments_purchaseId', 'billPayments', 'purchaseId'],
    ['idx_purchaseDetails_productId', 'purchaseDetails', 'productId'],
    ['idx_quantityAdjustments_productId', 'quantityAdjustments', 'productId'],
    ['idx_priceAdjustments_productId', 'priceAdjustments', 'productId'],
    ['idx_profits_orderId', 'profits', 'orderId'],
]

const ensureIndices = async () => {
    for (const [name, table, column] of indices) {
        if (await db.schema.hasTable(table)) {
            await db.raw(`CREATE INDEX IF NOT EXISTS ${name} ON ${table} (${column})`);
        }
    }
}

export default ensureIndices;
