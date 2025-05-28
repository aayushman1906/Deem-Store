const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('.')); // Serve static files from current directory

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aayushmanthakulla@gmail.com',
        pass: 'your-app-specific-password' // You'll need to generate this from Google Account
    }
});

// Handle order submission
app.post('/submit-order', async (req, res) => {
    try {
        const { name, email, phone, address, productName, productImage } = req.body;

        // Email to customer
        const customerMailOptions = {
            from: 'aayushmanthakulla@gmail.com',
            to: email,
            subject: 'Order Confirmation - Deem & Store',
            html: `
                <h2>Thank you for your order!</h2>
                <p>Dear ${name},</p>
                <p>We have received your order for ${productName}.</p>
                <p>Order Details:</p>
                <ul>
                    <li>Product: ${productName}</li>
                    <li>Phone: ${phone}</li>
                    <li>Address: ${address}</li>
                </ul>
                <p>We will process your order shortly and contact you for further details.</p>
                <p>Best regards,<br>Deem & Store Team</p>
            `
        };

        // Email to admin
        const adminMailOptions = {
            from: 'aayushmanthakulla@gmail.com',
            to: 'aayushmanthakulla@gmail.com',
            subject: 'New Order Received - Deem & Store',
            html: `
                <h2>New Order Received</h2>
                <p>Customer Details:</p>
                <ul>
                    <li>Name: ${name}</li>
                    <li>Email: ${email}</li>
                    <li>Phone: ${phone}</li>
                    <li>Address: ${address}</li>
                    <li>Product: ${productName}</li>
                </ul>
                <p>Product Image: <img src="${productImage}" alt="${productName}" style="max-width: 200px;"></p>
            `
        };

        // Send emails
        await transporter.sendMail(customerMailOptions);
        await transporter.sendMail(adminMailOptions);

        res.status(200).json({ message: 'Order received and emails sent successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error processing order' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 