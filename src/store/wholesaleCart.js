import {stat} from "fs-extra";

const wholesaleCartModule = {

    namespaced: true,

    state: () => ({
        cart: [],
        tax: 0,
        cashTendered: 0,
        profit: 0
    }),


    //......................................Getters..................................
    getters: {
        cart: (state) => {
            return state.cart;
        },

        getProfit: (state) => {//Get profit
            let profit = 0;
            for (const item of state.cart) {
                profit += ( (parseFloat(item.sellingPrice) - parseFloat(item.buyingPrice)) * parseInt(item.qty) ) - parseFloat(item.discount);
            }
            return profit;
        },

        getTax: state => state.tax, //get tax for checkout use

        //Get total tax
        totalTax: (state) => {
            const sum = [0];
            const tax = parseFloat(state.tax) / 100;
            for (const item of state.cart) {
                if (item.tax === "tax"){
                    let price = parseFloat(item.sellingPrice);
                    let qty = parseFloat(item.qty);
                    let res = (price * qty) * tax;
                    sum.push(res);
                }
            }
            return sum.reduce((previousValue, currentValue) => previousValue + currentValue);
        },
        // Get total discount
        totalDiscount: (state) => {
            const sum = [0];
            for (const item of state.cart) {
                sum.push(parseFloat(item.discount));
            }
            return sum.reduce((previousValue, currentValue) => previousValue + currentValue);
        },
        //Get subtotal
        subTotal: (state) => {
            const sum = [0];
            for (const item of state.cart) {
                sum.push(parseFloat(item.sellingPrice * item.qty));
            }
            return sum.reduce((previousValue, currentValue) => previousValue + currentValue);
        },
        //Get cart total
        total: (state, getters) => {
            return (getters.subTotal + getters.totalTax) - getters.totalDiscount
        },

        cashTendered: state => state.cashTendered, //Get cash tendered

        barcode : state => state.barcode,
    },


    //...........................................Mutations...............................
    mutations: {
        //Add item to cart
        addToCart: (state, payload) => {
            let inCart = false;
            for (const item of state.cart) {
                if (item.id === payload.id) { // if item is in cart
                    item.qty += 1;
                    inCart = true;
                    break;
                }
            }
            if (!inCart) { //if item is not in cart
                payload.sellingPrice = payload.originalPrice;
                payload.discount = 0;
                payload.qty = 1;
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
                    if (item.qty > 1) item.qty--;
                }
            })
        }, // ./decrement

        // edit cart item
        edit: (state, payload) => {
            payload.discount = payload.discount || 0;
            for (const item of state.cart) {
                if (item.id === payload.id) {
                    item.sellingPrice = payload.sellingPrice;
                    item.discount = payload.discount;
                    item.qty = payload.qty;
                }
            }
        },

        //Set cash tendered
        setCashTendered: (state, payload) => {
            state.cashTendered = payload;
        },
        //Clear the cart
        clearCart: (state) => state.cart = [],

        //Set Tax
        setTax: (state, payload) => {state.tax = payload},

        //Put on hold
        putOnHold: (state, {payload, getters}) => {
            if (!sessionStorage.heldItems) sessionStorage.heldItems = JSON.stringify([]);
            const id = new Date().getTime();
            const heldItems = JSON.parse(sessionStorage.heldItems)
            heldItems.unshift({id, type:'wholesale', cart: state.cart, total: getters.total})
            sessionStorage.heldItems = JSON.stringify(heldItems);
            state.cart = [];
        },

        //Un-hold item
        unhold: (state, payload) => {
            state.cart = payload;
        },

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

        setCashTendered:({ commit }, payload) => { // set cash tendered
            commit('setCashTendered', payload)
        },

        clearCart: ({ commit }) => { //Clear the cart
            commit('clearCart')
        },

        setTax: ({commit}, payload) => { //Set Tax
            commit('setTax', parseFloat(payload))
        },

        putOnHold: ({commit, getters}, payload) => { //Put on hold
            commit('putOnHold', {payload, getters})
        },

        unhold: ({commit}, payload) => { //Unhold item
            commit('unhold', payload)
        }
    }

}


export default wholesaleCartModule;