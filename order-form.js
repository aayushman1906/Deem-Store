document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');
    const productImage = urlParams.get('image');

    if (productName && productImage) {
        document.getElementById('productName').textContent = productName;
        document.getElementById('productImage').src = productImage;
    } else {
        document.querySelector('.product-preview').innerHTML = `
            <h2>Place Your Order</h2>
            <p>Fill out the form below to place your order</p>
        `;
    }

    const form = document.getElementById('orderForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;

        const formData = new FormData(form);
        const orderData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            quantity: formData.get('quantity'),
            productName: productName || 'General Order',
            productImage: productImage || ''
        };

        try {
            const response = await fetch('http://localhost:3000/submit-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Order placed successfully! We will contact you soon.');
                window.close();
            } else {
                throw new Error(data.message || 'Failed to submit order');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + (error.message || 'There was an error placing your order. Please try again.'));
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
}); 