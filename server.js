const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

// Serve static files
app.use(express.static(path.join(__dirname, '.')));

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aayushmanthakulla@gmail.com',
        pass: 'uzgp dstn fxax ssyk'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter
transporter.verify(function(error, success) {
    if (error) {
        console.log('Email configuration error:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

// Test email route
app.get('/test-email', async (req, res) => {
    try {
        const testMailOptions = {
            from: 'aayushmanthakulla@gmail.com',
            to: 'aayushmanthakulla@gmail.com',
            subject: 'Test Email - Deem & Store',
            html: '<h1>This is a test email</h1><p>If you receive this, the email configuration is working correctly.</p>'
        };

        await transporter.sendMail(testMailOptions);
        res.json({ message: 'Test email sent successfully' });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ message: 'Error sending test email: ' + error.message });
    }
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Handle order submission
app.post('/submit-order', async (req, res) => {
    try {
        const { name, email, phone, address, productName, productImage, quantity } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !address || !productName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Email to customer
        const customerMailOptions = {
            from: 'aayushmanthakulla@gmail.com',
            to: email,
            subject: 'Order Confirmation - Deem & Store',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #2c3e50;">Thank You for Your Order!</h1>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                        <p style="font-size: 16px; color: #333;">Dear ${name},</p>
                        <p style="font-size: 16px; color: #333;">We have received your order for ${productName}.</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <img src="${productImage}" alt="${productName}" style="max-width: 200px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        </div>
                        <h3 style="color: #2c3e50;">Order Details:</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 10px 0;"><strong>Product:</strong> ${productName}</li>
                            <li style="margin: 10px 0;"><strong>Quantity:</strong> ${quantity}</li>
                            <li style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</li>
                            <li style="margin: 10px 0;"><strong>Address:</strong> ${address}</li>
                        </ul>
                        <p style="font-size: 16px; color: #333;">We will process your order shortly and contact you for further details.</p>
                    </div>
                    <div style="text-align: center; margin-top: 30px; color: #666;">
                        <p>Best regards,<br>Deem & Store Team</p>
                    </div>
                </div>
            `
        };

        // Email to admin
        const adminMailOptions = {
            from: 'aayushmanthakulla@gmail.com',
            to: 'aayushmanthakulla@gmail.com',
            subject: 'New Order Received - Deem & Store',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #2c3e50;">New Order Received</h1>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                        <h3 style="color: #2c3e50;">Customer Details:</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 10px 0;"><strong>Name:</strong> ${name}</li>
                            <li style="margin: 10px 0;"><strong>Email:</strong> ${email}</li>
                            <li style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</li>
                            <li style="margin: 10px 0;"><strong>Address:</strong> ${address}</li>
                            <li style="margin: 10px 0;"><strong>Product:</strong> ${productName}</li>
                            <li style="margin: 10px 0;"><strong>Quantity:</strong> ${quantity}</li>
                        </ul>
                        <div style="text-align: center; margin: 20px 0;">
                            <img src="${productImage}" alt="${productName}" style="max-width: 200px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        </div>
                    </div>
                </div>
            `
        };

        // Send emails
        await transporter.sendMail(customerMailOptions);
        await transporter.sendMail(adminMailOptions);

        // Send response with image data
        res.status(200).json({ 
            message: 'Order received and emails sent successfully',
            productImage: productImage,
            productName: productName
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error processing order: ' + error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test the server at: http://localhost:${PORT}/test`);
}); 