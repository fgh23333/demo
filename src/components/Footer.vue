<template>
    <ul class="footer">
        <li @click="toHome()">
            <i class="icon icon-home" />
            <p>首页</p>
        </li>
        <li @click="toCart()">
            <i class="icon icon-cart" />
            <p>购物车</p>
        </li>
        <li @click="toOrder()">
            <i class="icon icon-order" />
            <p>订单</p>
        </li>
        <li @click="toCenter()">
            <i class="icon icon-me" />
            <p>我的</p>
        </li>
    </ul>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter();
const toHome = () => {
    router.push('/').catch(e => { });
}
const toCenter = () => {
    // 检查是否登录
    const account = sessionStorage.getItem('account');
    if (account) {
        router.push('/profile').catch(e => { });
        return;
    } else {
        // 如果未登录，跳转到登录页面
        alert('请先登录');
        router.push('/login').catch(e => { });
        return;
    }
}
const toCart = () => {
    router.push('/cart').catch(e => { });
}
const toOrder = () => {
    router.push('/orderList').catch(e => { });
}
</script>

<style scoped>
.icon {
    width: 8vw;
    height: 8vw;
    display: block;
    background-size: cover;
}

.icon-me {
    background-image: url(../assets/me.png);
}

.icon-order {
    background-image: url(../assets/order.png);
}

.icon-home {
    background-image: url(../assets/home.png);
}

.icon-cart {
    background-image: url(../assets/cart.png);
}

/*/////底部导航栏/////*/
.wrapper .footer {
    width: 100%;
    height: 14vw;
    border-top: solid 1px #ddd;
    background-color: #fff;
    position: fixed;
    left: 0;
    bottom: -0.1vw;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.wrapper .footer li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #79859E;
    user-select: none;
    cursor: pointer;
}

.wrapper .footer li p {
    font-size: 2.8vw;
}

.wrapper .footer li i {
    font-size: 5vw;
}
</style>