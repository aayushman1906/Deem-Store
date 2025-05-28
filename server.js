const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('.')); // Serve static files from current directory

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'aayushmanthakulla@gmail.com',
        pass: 'your-app-password' // Replace with your Gmail App Password
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Handle order submission
app.post('/submit-order', async (req, res) => {
    const { name, email, phone, address, quantity, productName, productImage } = req.body;

    // Email content
    const mailOptions = {
        from: 'aayushmanthakulla@gmail.com',
        to: 'aayushmanthakulla@gmail.com',
        subject: 'New Order Received',
        html: `
            <h2>New Order Details</h2>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Customer Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Delivery Address:</strong> ${address}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            ${productImage ? `<p><strong>Product Image:</strong> <img src="${productImage}" style="max-width: 200px;"></p>` : ''}
        `
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({ message: 'Order submitted successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error submitting order: ' + error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 