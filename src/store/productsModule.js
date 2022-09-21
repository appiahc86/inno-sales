const productsModule = {

    namespaced: true,

    state: () => ({
        products: [],
    }),


    //......................................Getters..................................
    getters: {

        productsCount: (state) => state.products.length,

        getLowQty: (state) => { //Get products below qty of 5
            return state.products.filter(item => parseInt(item.quantity) < 5);
        },

        getExpiringProducts: (state) => { //Get expiring products
            const listOfExpiringProducts = [];
            const getProductsWithExpDate = state.products.filter(product => product.expiration);
            const today = new Date();


            for (const item of getProductsWithExpDate){
                const expDate = new Date(item.expiration);
                let notificationStartDate = expDate.setDate(expDate.getDate() - 14);
                 notificationStartDate = new Date(notificationStartDate);
                const notificationEndDate = new Date(item.expiration);
                     if (today >= notificationStartDate && today < notificationEndDate){
                         listOfExpiringProducts.push(item.id)
                    }
              }

            return listOfExpiringProducts;
        }, // ./Expiring products

        getAlreadyExpiredProducts: (state) => { //Already expired products
            const listOfExpiredProducts = [];
            const getProductsWithExpDate = state.products.filter(product => product.expiration);
            const today = new Date();

            for (const item of getProductsWithExpDate){
                const expDate = new Date(item.expiration);

                if (today >= expDate){
                    listOfExpiredProducts.push(item.id);
                }
            }

            return listOfExpiredProducts;
        }


    }, //./Getters




    //...........................................Mutations...............................//
    mutations: {
        //  set products
        setProducts: (state, payload) => {
            state.products = payload;
        },

        //  Add product
        addProduct: (state, payload) => {
            state.products.push({
                id: payload.id, quantity: payload.quantity, expiration: payload.expiration
            });
        },

        //Modify Quantity
        modifyQty: (state, {id, qty, type}) => {
            for (const product of state.products) {
                if (product.id.toString() === id.toString()){
                    if (type === 'increment') {
                        product.quantity = parseInt(product.quantity) + parseInt(qty);
                    }
                    else {
                        product.quantity = parseInt(product.quantity) - parseInt(qty);
                    }
                    break;
                }
            }
        },

        //Delete product
        deleteProduct: (state, payload) => {
            const newPros = [];
            for (const p of state.products) {
                if (!payload.includes(p.id)) newPros.push(p)
            }
            state.products = newPros;
        },

        //Modify date
        modifyDate: (state, {id, date}) => {
            for (const p of state.products) {
                if (p.id.toString() === id.toString()) {
                    p.expiration = date ? date : p.expiration;
                    break;
                }
            }
        },

    },



    //...........................Actions....................................
    actions: {
        setProducts: ({ commit }, payload) => { //set Products
            commit('setProducts', payload);
        },
        addProduct: ({ commit }, payload) => { //Add product
            commit('addProduct', payload);
        },

        modifyQty: ({ commit }, payload) => { //Modify Quantity
            commit('modifyQty', payload);
        },

        deleteProduct: ({ commit }, payload) => { //delete Product
            commit('deleteProduct', payload);
        },

        modifyDate: ({ commit }, payload) => { //Modify Date
            commit('modifyDate', payload);
        },

    }

}


export default productsModule;