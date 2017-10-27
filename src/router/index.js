import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import MyDesign from '@/views/myDesign'
import Cart from '@/views/cart'
import Address from '@/views/Address'
import order from '@/views/orderList'


Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
            path: '/',
            name: 'Index',
            component: Index
        }, {
            path: '/MyDesign',
            name: 'MyDesign',
            component: MyDesign
        },
        {
            path: '/Cart',
            name: 'Cart',
            component: Cart
        },
        {
            path: '/Address',
            name: 'Address',
            component: Address
        },
        {
            path: '/orderList',
            name: 'orderList',
            component: orderList
        }
    ]
})