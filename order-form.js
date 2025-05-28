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
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/submit-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to place order');
            }

            const result = await response.json();
            
            // Show success message
            const formContainer = document.querySelector('.form-container');
            formContainer.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h2>Thank You for Your Order!</h2>
                    <p>Dear ${formData.name},</p>
                    <p>Your order for ${formData.productName} has been received.</p>
                    <p>We have sent a confirmation email to ${formData.email}</p>
                    <p>We will process your order shortly and contact you for further details.</p>
                    <button onclick="window.close()" class="close-button">Close Window</button>
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + (error.message || 'Failed to connect to server. Please try again later.'));
        } finally {
            submitButton.textContent = 'Place Order';
            submitButton.disabled = false;
        }
    });
}); 