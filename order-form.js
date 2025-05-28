document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('productName');
    const productImage = urlParams.get('productImage');

    if (productName && productImage) {
        document.getElementById('product-name').textContent = productName;
        document.getElementById('product-image').src = productImage;
    } else {
        document.getElementById('product-name').textContent = 'Product';
        document.getElementById('product-image').src = 'default-product.jpg';
    }

    const orderForm = document.getElementById('orderForm');
    orderForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            productName: document.getElementById('product-name').textContent,
            productImage: document.getElementById('product-image').src
        };

        try {
            const response = await fetch('/submit-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Order placed successfully! We will contact you soon.');
                window.close();
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            submitButton.textContent = 'Place Order';
            submitButton.disabled = false;
        }
    });
}); 