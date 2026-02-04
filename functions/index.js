const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// Configuration
// Run logging to see if config is loaded
// Setup config via: firebase functions:config:set cashfree.app_id="APP_ID" cashfree.secret_key="SECRET_KEY" cashfree.env="sandbox"

const getCashfreeConfig = () => {
    // Using standard .env variables (firebase functions:config is deprecated)
    const env = process.env.CASHFREE_ENV || "sandbox";

    let appId, secretKey;

    if (env === "production") {
        appId = process.env.CASHFREE_PROD_APP_ID;
        secretKey = process.env.CASHFREE_PROD_SECRET_KEY;
    } else {
        appId = process.env.CASHFREE_SANDBOX_APP_ID;
        secretKey = process.env.CASHFREE_SANDBOX_SECRET_KEY;
    }

    // Fallback for simple setup
    if (!appId) appId = process.env.CASHFREE_APP_ID;
    if (!secretKey) secretKey = process.env.CASHFREE_SECRET_KEY;

    return { appId, secretKey, env };
};

const getBaseUrl = (env) => {
    return env === "production"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";
};

const getHeaders = (appId, secretKey) => {
    return {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": appId,
        "x-client-secret": secretKey
    };
};

const PRICING_TABLE = {
    "MONTHLY99": 99,
    "YEARLY599": 599
};

/**
 * Create Payment Order
 * Params: planId, currency, customerData
 */
exports.createPaymentOrder = functions.https.onCall(async (data, context) => {
    // Auth check (optional but recommended)
    // if (!context.auth) {
    //     throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    // }

    const { planId, currency, customerData } = data;
    const { appId, secretKey, env } = getCashfreeConfig();

    if (!appId || !secretKey) {
        throw new functions.https.HttpsError('failed-precondition', 'Cashfree credentials not configured.');
    }

    const amount = PRICING_TABLE[planId];
    if (!amount) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid Plan ID provided.');
    }

    const orderId = "order_" + Math.floor(10000 + Math.random() * 90000) + "_" + Date.now();
    const baseUrl = getBaseUrl(env);

    const payload = {
        order_amount: amount,
        order_currency: currency || "INR",
        order_id: orderId,
        customer_details: {
            customer_id: customerData.uid || "guest_" + Date.now(),
            customer_phone: customerData.phone || "9999999999",
            customer_email: customerData.email || "test@test.com"
        },
        order_meta: {
            // Note: return_url handling might need adjustment depending on frontend routing
            return_url: "http://localhost:3000/pricing?order_id={order_id}" // Default to localhost, needs dynamic update
        }
    };

    // If production, update return_url appropriately or pass it from frontend
    if (data.returnUrl) {
        payload.order_meta.return_url = data.returnUrl;
    }

    try {
        const response = await axios.post(`${baseUrl}/orders`, payload, {
            headers: getHeaders(appId, secretKey)
        });

        return {
            status: "success",
            payment_session_id: response.data.payment_session_id,
            order_id: response.data.order_id,
            data: response.data
        };

    } catch (error) {
        const errorData = error.response?.data || {};
        console.error("Cashfree Create Order Error:", errorData);

        // Pass more detail back to the frontend to debug
        throw new functions.https.HttpsError(
            'internal',
            `Cashfree Error: ${errorData.message || error.message}`,
            errorData
        );
    }
});

/**
 * Verify Payment Status
 * Params: orderId
 */
exports.verifyPaymentStatus = functions.https.onCall(async (data, context) => {
    const { orderId } = data;
    const { appId, secretKey, env } = getCashfreeConfig();

    if (!orderId) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid orderId.');
    }

    const baseUrl = getBaseUrl(env);

    try {
        const response = await axios.get(`${baseUrl}/orders/${orderId}/payments`, {
            headers: getHeaders(appId, secretKey)
        });

        const payments = response.data;

        if (Array.isArray(payments) && payments.length > 0) {
            // Check for any successful payment
            const successfulPayment = payments.find(p => p.payment_status === "SUCCESS");
            if (successfulPayment) {
                return {
                    status: "success",
                    order_id: successfulPayment.order_id,
                    payment_status: "PAID",
                    data: successfulPayment
                };
            }

            // Check for pending
            const pendingPayment = payments.find(p => p.payment_status === "PENDING");
            if (pendingPayment) {
                return {
                    status: "success",
                    payment_status: "ACTIVE",
                    data: pendingPayment
                };
            }

            return {
                status: "success",
                payment_status: payments[0].payment_status,
                data: payments[0]
            };
        } else {
            return { status: "success", payment_status: "ACTIVE", data: { message: "No payment attempts found" } };
        }

    } catch (error) {
        console.error("Cashfree Verify Error:", error.response?.data || error.message);
        throw new functions.https.HttpsError('internal', 'Unable to verify payment status', error.response?.data);
    }
});
