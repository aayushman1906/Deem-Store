// Function to show the order form modal
function showOrderForm(productName, productImage) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Order Form</h2>
            <form id="orderForm">
                <div class="form-group">
                    <label for="name">Full Name:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number:</label>
                    <input type="tel" id="phone" name="phone" required>
                </div>
                <div class="form-group">
                    <label for="address">Delivery Address:</label>
                    <textarea id="address" name="address" required></textarea>
                </div>
                <div class="form-group">
                    <label for="quantity">Quantity:</label>
                    <input type="number" id="quantity" name="quantity" min="1" value="1" required>
                </div>
                <input type="hidden" id="productName" name="productName" value="${productName}">
                <input type="hidden" id="productImage" name="productImage" value="${productImage}">
                <div class="button-group">
                    <button type="button" class="preview-button">Preview Order</button>
                    <button type="submit" class="submit-button">Confirm & Place Order</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.remove();
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    }

    // Preview Order functionality
    const previewBtn = modal.querySelector('.preview-button');
    previewBtn.onclick = function() {
        const form = document.getElementById('orderForm');
        const formData = new FormData(form);
        
        const previewModal = document.createElement('div');
        previewModal.className = 'modal';
        previewModal.innerHTML = `
            <div class="modal-content preview-content">
                <span class="close">&times;</span>
                <h2>Order Preview</h2>
                <div class="preview-details">
                    <div class="preview-item">
                        <img src="${formData.get('productImage')}" alt="${formData.get('productName')}" class="preview-image">
                        <div class="preview-info">
                            <h3>${formData.get('productName')}</h3>
                            <p><strong>Quantity:</strong> ${formData.get('quantity')}</p>
                        </div>
                    </div>
                    <div class="preview-customer">
                        <h3>Customer Details</h3>
                        <p><strong>Name:</strong> ${formData.get('name')}</p>
                        <p><strong>Email:</strong> ${formData.get('email')}</p>
                        <p><strong>Phone:</strong> ${formData.get('phone')}</p>
                        <p><strong>Delivery Address:</strong> ${formData.get('address')}</p>
                    </div>
                    <div class="preview-actions">
                        <button class="edit-button">Edit Order</button>
                        <button class="confirm-button">Confirm Order</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(previewModal);

        // Close preview modal
        const previewCloseBtn = previewModal.querySelector('.close');
        previewCloseBtn.onclick = function() {
            previewModal.remove();
        }

        // Edit button functionality
        const editBtn = previewModal.querySelector('.edit-button');
        editBtn.onclick = function() {
            previewModal.remove();
        }

        // Confirm button functionality
        const confirmBtn = previewModal.querySelector('.confirm-button');
        confirmBtn.onclick = function() {
            submitOrder(formData);
            previewModal.remove();
            modal.remove();
        }
    }

    // Form submission
    const form = document.getElementById('orderForm');
    form.onsubmit = async function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        submitOrder(formData);
    };
}

// Function to submit the order
async function submitOrder(formData) {
    const orderData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        quantity: formData.get('quantity'),
        productName: formData.get('productName'),
        productImage: formData.get('productImage')
    };

    try {
        const response = await fetch('/submit-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert('Order placed successfully! We will contact you soon.');
        } else {
            alert('There was an error placing your order. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error placing your order. Please try again.');
    }
}

// Add click event listeners to all service cards
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const productName = this.querySelector('h3').textContent;
            const productImage = this.querySelector('img').src;
            
            // Open order form in new tab
            const orderFormUrl = `order-form.html?product=${encodeURIComponent(productName)}&image=${encodeURIComponent(productImage)}`;
            window.open(orderFormUrl, '_blank');
        });
    });
}); 