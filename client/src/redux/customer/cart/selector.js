export const getSelectedCartData = (state) => {
    const { cart, selectedItems } = state.cart;

    if (!cart || !cart.cartItems || !selectedItems) return null;

    // Filter only selected items
    const selectedCartItems = cart.cartItems.filter(item =>
        selectedItems.includes(item.id)
    );

    // Calculate totals for selected items
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
};