// app.js
console.log('PayPal Client ID:', config.paypalClientId);
console.log('PayPal Client Secret:', config.paypalClientSecret);

let barer;

function fetchPayPalToken() {
    const clientId = config.paypalClientId;
    const clientSecret = config.paypalClientSecret;

    const authString = `${clientId}:${clientSecret}`;
    const base64Auth = btoa(authString);

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${base64Auth}`,
        },
        body: 'grant_type=client_credentials',
    };

    return fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log('data', data);
            if (data.access_token) {
                return data.access_token;
            } else {
                throw new Error('Invalid PayPal response');
            }
        })
        .catch(error => {
            console.error('Error fetching PayPal token:', error);
            throw error; // Rethrow the error to handle it elsewhere
        });
}

// Utilisez la fonction pour récupérer le token
fetchPayPalToken()
    .then(token => {
        // Maintenant, vous avez le token, utilisez-le comme nécessaire
        barer = token;

        // Reste de votre code...
        // createInvoice(editor.get());
    })
    .catch(error => {
        // Gérez les erreurs ici
        console.error('Error fetching PayPal token:', error);
    });


// create the editor
const container = document.getElementById('jsoneditor')
const options = {
    "mode": "tree",
    "search": true
};
const editor = new JSONEditor(container, options)

// UPDATE THE PAYLOAD BASED ON CURRENT DATE
var timestp = Date.now();
var invoiceID = "invoicetest" + timestp;

const today = new Date();
const year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();

if (month < 10) {
    month = `0${month}`;
}

if (day < 10) {
    day = `0${day}`;
}

const dateInvoice = `${year}-${month}-${day}`;


const json = {
    "detail": {
        "invoice_number": invoiceID,
        "reference": "deal-ref",
        "invoice_date": dateInvoice,
        "currency_code": "USD",
        "note": "Thank you for your business.",
        "term": "No refunds after 30 days.",
        "memo": "This is a long contract",
        "payment_term": {
            // "term_type": "DUE_ON_RECEIPT",
            // "term_type": "DUE_ON_DATE_SPECIFIED",
            "term_type": "NET_30",
            // "due_date": dateInvoice
        }
    },
    "invoicer": {
        "name": {
            "given_name": "David",
            "surname": "Larusso"
        },
        "address": {
            "address_line_1": "1234 First Street",
            "address_line_2": "337673 Hillside Court",
            "admin_area_2": "Anytown",
            "admin_area_1": "CA",
            "postal_code": "98765",
            "country_code": "US"
        },
        "phones": [{
            "country_code": "001",
            "national_number": "4085551234",
            "phone_type": "MOBILE"
        }],
        "website": "https://example.com",
        "tax_id": "XX-XXXXXXX",
        "logo_url": "https://example.com/logo.PNG",
        "additional_notes": "example note"
    },
    "primary_recipients": [{
        "billing_info": {
            "name": {
                "given_name": "John",
                "surname": "Doe"
            },
            "address": {
                "address_line_1": "Av. de la Pelouse",
                "admin_area_2": "Anytown",
                "admin_area_1": "CA",
                "postal_code": "75001",
                "country_code": "FR"
            },
            "email_address": "lucaskameleoon@gmail.com",
            "phones": [{
                "country_code": "001",
                "national_number": "4884551234",
                "phone_type": "HOME"
            }],
            "additional_info_value": "add-info"
        },
        "shipping_info": {
            "name": {
                "given_name": "Stephanie",
                "surname": "Meyers"
            },
            "address": {
                "address_line_1": "1234 Main Street",
                "admin_area_2": "Anytown",
                "admin_area_1": "CA",
                "postal_code": "98765",
                "country_code": "US"
            }
        }
    }],
    "items": [{
            "name": "Yoga Mat",
            "description": "Elastic mat to practice yoga.",
            "quantity": "1",
            "unit_amount": {
                "currency_code": "USD",
                "value": "50.00"
            },
            "tax": {
                "name": "Sales Tax",
                "percent": "7.25"
            },
            "discount": {
                "percent": "5"
            },
            "unit_of_measure": "QUANTITY"
        },
        {
            "name": "Yoga t-shirt",
            "quantity": "1",
            "unit_amount": {
                "currency_code": "USD",
                "value": "10.00"
            },
            "tax": {
                "name": "Sales Tax",
                "percent": "7.25"
            },
            "discount": {
                "amount": {
                    "currency_code": "USD",
                    "value": "5.00"
                }
            },
            "unit_of_measure": "QUANTITY"
        }
    ],
    "configuration": {
        "partial_payment": {
            "allow_partial_payment": true,
            "minimum_amount_due": {
                "currency_code": "USD",
                "value": "20.00"
            }
        },
        "allow_tip": true,
        "tax_calculated_after_discount": true,
        "tax_inclusive": false,
        "template_id": ""
    },
    "amount": {
        "breakdown": {
            "custom": {
                "label": "Packing Charges",
                "amount": {
                    "currency_code": "USD",
                    "value": "10.00"
                }
            },
            "shipping": {
                "amount": {
                    "currency_code": "USD",
                    "value": "10.00"
                },
                "tax": {
                    "name": "Sales Tax",
                    "percent": "7.25"
                }
            },
            "discount": {
                "invoice_discount": {
                    "percent": "5"
                }
            }
        }
    }
}

editor.set(json);
editor.expandAll();

function generateInvoiceNumber() {
    if (confirm("Ce numéro de facture est déjà utilisé, générer le suivant ? ")) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + barer
            },
        };

        fetch('https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number', options)
            .then(response => response.json())
            .then(function (response) {
                console.log(response)
                json.detail.invoice_number = response.invoice_number
                editor.set(json);
                editor.expandAll();
            })
            .catch(err => console.error(err));
    }
}

document.getElementById('getJSON').onclick = function () {
    createInvoice(editor.get());
}

function createInvoice(dataFromFront) {
    data = JSON.stringify(dataFromFront);
    console.log(data)

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + barer
        },
        body: data
    };

    fetch('https://api-m.sandbox.paypal.com/v2/invoicing/invoices', options)
        // .then(response => response.json())
        .then(response => {
            if (!response.ok) {
                return response.json().then(res => {
                    console.log(res);
                    document.querySelector('#response').innerHTML = "";
                    document.querySelector('.action').style.visibility = "hidden"
                    document.querySelector('#response').innerHTML += res.prettyPrint();
                    document.querySelector('#QRCode img').src = ""
                    document.querySelector('.view').style.visibility = "hidden"
                    document.querySelector('.subResponse pre').innerHTML = "";

                    //IF DUPLICATE INVOICE NUMBER
                    if (res.details[0].issue == "DUPLICATE_INVOICE_NUMBER") {
                        console.log('ERROR : ' + res.details[0].issue)
                        setTimeout(() => {
                            generateInvoiceNumber()
                        }, 1000);
                    }
                });


            }
            return response.json();
        })
        .then(function (response) {

            console.log(response);

            if (response !== undefined) {
                // document.querySelector('#response').innerHTML += response.href.prettyPrint();
                document.querySelector('#response').innerHTML = "";
                document.querySelector('#response').innerHTML += response.prettyPrint();
                invoiceIDgenerated = response.href.split('/')[6];

                document.querySelector('.action').style.visibility = "inherit"

                //Set url for get
                document.getElementById("getInvoiceBtn").onclick = function () {
                    getInvoice(invoiceIDgenerated);
                };
                //Set img for QRCode
                document.getElementById("generateQRBtn").onclick = function () {
                    generateQR(invoiceIDgenerated);
                };

            }


        })
        .catch(err => console.error(err));
}

function getInvoice(invoiceID) {
    const options = {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + barer
        }
    };

    fetch('https://api.sandbox.paypal.com/v2/invoicing/invoices/' + invoiceID, options)
        .then(response => response.json())
        .then(function (response) {
            console.log(response)

            document.querySelector('.subResponse pre').innerHTML = "";
            document.querySelector('.subResponse pre').innerHTML += response.prettyPrint();

            invoiceSendLink = response.links[1].href;

            console.log('invoice send link : ' + invoiceSendLink)

            document.getElementById("sendInvoiceBtn").onclick = function () {
                postInvoice(invoiceSendLink);
            };
            document.getElementById("sendInvoiceBtn").style.visibility = "inherit"


            invoiceBuyerView = response.detail.metadata.recipient_view_url;
            invoiceSellerView = response.detail.metadata.invoicer_view_url;

            $('#viewBuyer').attr("href", invoiceBuyerView);
            $('#viewSeller').attr("href", invoiceSellerView);
        })
        .catch(err => console.error(err));
}

function postInvoice(invoiceSendLink) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + barer
        },
        body: '{"send_to_invoicer":true,"send_to_recipient":true}'
    };

    fetch(invoiceSendLink, options)
        .then(response => response.json())
        .then(function (response) {
            console.log(response)

            document.querySelector('.view').style.visibility = "inherit"

            $("#getInvoiceBtn").click();

            document.getElementById("generateQRBtn").style.visibility = "inherit"

        })
        .catch(err => console.error(err));
}

function generateQR(invoiceID) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + barer
        },
        body: '{"width":400,"height":400}'
    };

    fetch("https://api.sandbox.paypal.com/v2/invoicing/invoices/" + invoiceID + "/generate-qr-code", options)
        .then(response => response.text())
        .then(function (response) {
            console.log(response)
            console.log(response.split("\n"))

            document.querySelector('#QRCode img').src = "data:image/png;base64," + response.split("\n")[4];

        })
        .catch(err => console.error(err));
}

//COLORING FEATURE
Object.prototype.prettyPrint = function () {
    var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
    var replacer = function (match, pIndent, pKey, pVal, pEnd) {
        var key = '<span class="json-key" style="color: brown">',
            val = '<span class="json-value" style="color: navy">',
            str = '<span class="json-string" style="color: olive">',
            r = pIndent || '';
        if (pKey)
            r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
        if (pVal)
            r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
        return r + (pEnd || '');
    };

    return JSON.stringify(this, null, 3)
        .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(jsonLine, replacer);
}

/*  console.log(data);
  })
  .catch(error => console.error(error));
  */