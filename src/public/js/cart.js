const updateCartBadge = (cart) => {

    const badge = document.getElementById('nav-cart-badge');

    if (!badge) return;

    badge.textContent = cart.products.reduce(
        (total, item) => total + item.quantity,
        0
    );
};

document.querySelectorAll('.add-to-cart').forEach(button => {

    button.addEventListener('click', async () => {

        const { cartId, productId } = button.dataset;

        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST'
        });

        const cart = await response.json();

        updateCartBadge(cart);

        const originalText = button.textContent;
        button.textContent = 'Agregado ✓';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1000);
    });

});

document.querySelectorAll('.remove-from-cart').forEach(button => {

    button.addEventListener('click', async () => {

        const { cartId, productId } = button.dataset;

        await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });

        location.reload();
    });

});

const clearCartButton = document.getElementById('clear-cart');

if (clearCartButton) {

    clearCartButton.addEventListener('click', async () => {

        const { cartId } = clearCartButton.dataset;

        await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE'
        });

        location.reload();
    });

}
