document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('productName');
    const productImage = urlParams.get('productImage');

    if (productName && productImage) {
        document.getElementById('productName').textContent = productName;
        const productImageElement = document.getElementById('productImage');
        const decodedImageUrl = decodeURIComponent(productImage);
        productImageElement.src = decodedImageUrl;
        productImageElement.style.display = 'block';
    } else {
        document.getElementById('productName').textContent = 'Product';
        document.getElementById('productImage').style.display = 'none';
    }

    if (productName) {
        document.getElementById('hiddenProductName').value = productName;
    }
    if (productImage) {
        document.getElementById('hiddenProductImage').value = productImage;
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
            quantity: document.getElementById('quantity').value,
            productName: document.getElementById('productName').textContent,
            productImage: document.getElementById('productImage').src
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
            
            // Show success message with product image
            const formContainer = document.querySelector('.order-container');
            formContainer.innerHTML = `
                <div class="success-message">
                    <div class="success-image">
                        <img src="${result.productImage}" alt="${result.productName}" style="max-width: 200px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    </div>
                    <h2>Thank You for Your Order!</h2>
                    <p>Dear ${formData.name},</p>
                    <p>Your order for ${result.productName} has been received.</p>
                    <p>Quantity: ${formData.quantity}</p>
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