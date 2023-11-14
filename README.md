## PayPal Invoice Generator

This project provides a simple web-based interface for generating [PayPal invoices](https://developer.paypal.com/docs/invoicing/integrate/) using the PayPal Invoicing API. It leverages HTML, JavaScript, Bootstrap, and Tailwind CSS to create an interactive and user-friendly environment.

### Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)

---

### Features

1. **Invoice Creation:** Generate PayPal invoices with customizable details such as invoice number, date, items, and more.

2. **Dynamic QR Code:** Generate QR codes for invoices, facilitating easy scanning and processing.

3. **Invoice Viewing:** Open and view generated invoices from the perspective of both the buyer and the seller.

4. **Responsive Design:** The interface is designed to be responsive, ensuring a seamless experience on various devices.

---

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lucaskameleoon/PayPal_invoicing.git


2. Open the project folder:

   ```bash
   cd paypal-invoice-generator


3. Open the index.html file in your preferred web browser.


### Usage

1. Open index.html in a web browser.

2. Fill in the required details for the invoice in the left panel.

3. Click the "Create INVOICE" button to generate the PayPal invoice.

4. Review the response, and if needed, take further actions such as viewing the invoice, sending it to the recipient, or generating a QR code.


### Usage

Before using the application, make sure to configure your PayPal Client ID and Client Secret in the config.js file.

Example config.js:

        var config = {
            paypalClientId: "YOUR_CLIENT_ID",
            paypalClientSecret: "YOUR_SECRET"
        };

Replace "YOUR_CLIENT_ID" and "YOUR_SECRET" with your PayPal Sandbox client ID and client secret.