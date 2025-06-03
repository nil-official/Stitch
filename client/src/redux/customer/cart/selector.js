import { createSelector } from 'reselect';

const cartSelector = (state) => state.cart.cart;
const selectedItemsSelector = (state) => state.cart.selectedItems;

export const getSelectedCartData = createSelector(
    [cartSelector, selectedItemsSelector],
    (cart, selectedItems) => {
        if (!cart || !cart.cartItems || !selectedItems) return null;

        const selectedCartItems = cart.cartItems.filter(item =>
            selectedItems.includes(item.id)
        );

        const totalItem = selectedCartItems.length;
        let totalPrice = 0;
        let totalDiscountedPrice = 0;

        selectedCartItems.forEach(item => {
            totalPrice += (item.product.price * item.quantity);
            totalDiscountedPrice += (item.product.discountedPrice * item.quantity);
        });

        const discount = totalPrice - totalDiscountedPrice;

        return {
            cartItems: selectedCartItems,
            totalItem,
            totalPrice,
            totalDiscountedPrice,
            discount
        };
    }
);