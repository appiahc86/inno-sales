
import CustomersView from "@/views/customers/CustomersView";
import OutstandingInvoiceView from "@/views/customers/OutstandingInvoiceView";
import InvoicePaymentView from "@/views/customers/InvoicePaymentView";

const customerRouter = [
    {
        path: '/customers',
        name: 'customers',
        component: CustomersView
    },
    {
        path: '/customers/outstanding',
        name: 'outstanding-customers',
        component: OutstandingInvoiceView
    },
    {
        path: '/customers/payments/:id/:invoiceNumber/:orderDate/:total/:payments/:name/:phone/:account/:customerId',
        name: 'invoice-payment',
        component: InvoicePaymentView
    },

]


export default customerRouter;
