const purchaseCartModule = {

    namespaced: true,

    state: () => ({
        cart: [],
    }),


    //......................................Getters..................................
    getters: {
        cart: (state) => {
            return state.cart;
        },

        //Get cart total
        total: (state) => {
            const sum = [0];
            for (const item of state.cart) {
                sum.push(parseFloat(item.buyingPrice * item.qty));
            }
            return sum.reduce((previousValue, currentValue) => previousValue + currentValue);
        }

    },


    //...........................................Mutations...............................//
    mutations: {
          //Add item to cart
        addToCart: (state, payload) => {
            let inCart = false;
            for (const item of state.cart) {
                if (item.id === payload.id) { // check if item is in cart
                    inCart = true;
                    break;
                }
            }
            if (!inCart) { //if item is not in cart
                state.cart.push(payload);
            }
        }, // ./Add item to cart

        //  Remove from cart
        removeFromCart: (state, payload) => {
            state.cart = state.cart.filter(item => item.id !== payload)
        },  //  ./Remove from cart

        //increment
        increment: (state, payload) => {
            state.cart.map(item => {
                if (item.id === payload) item.qty++
            })
        },  // ./increment


        // decrement
        decrement: (state, payload) => {
            state.cart.map(item =>{
                if (item.id === payload) {
                    if (item.qty > 1) item.qty--
                 }
          })
        }, // ./decrement

        // edit cart item
        edit: (state, payload) => {

            for (const item of state.cart) {
                if (item.id === payload.id) {
                    item.buyingPrice = payload.buyingPrice;
                    item.qty = payload.qty;
                }
            }
        },

        //Clear the cart
        clearCart: (state) => state.cart = []

    },



    //...........................Actions....................................
    actions: {
        addToCart: ({ commit }, payload) => { //Add to cart
            commit('addToCart', payload)
        },
        removeFromCart: ({ commit }, payload) => { //  Remove from cart
            commit('removeFromCart', payload)
        },
        increment: ({ commit }, payload) => { // increment
            commit('increment', payload)
        },
        decrement: ({ commit }, payload) => { // decrement
            commit('decrement', payload)
        },
        edit:({ commit }, payload) => { // edit cart item
            commit('edit', payload)
        },

        clearCart: ({ commit }) => { //Clear the cart
            commit('clearCart')
        },

    }

}



export default purchaseCartModule;