import { load } from '@cashfreepayments/cashfree-js';

let cashfree;
export const initializeCashfree = async () => {
    cashfree = await load({
        mode: process.env.REACT_APP_CASHFREE_ENV || "sandbox"
    });
};

const BASE_URL = process.env.REACT_APP_CASHFREE_ENV === "production" 
    ? "https://api.cashfree.com/pg" 
    : "/pg-proxy";

const getHeaders = () => {
    return {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.REACT_APP_CASHFREE_APP_ID,
        "x-client-secret": process.env.REACT_APP_CASHFREE_SECRET_KEY
    };
};
function getRandom5DigitNumber() {
  return Math.floor(10000 + Math.random() * 90000);
}

export const createPaymentIntent = async (amount, currency = "INR", customerData) => {
    try {
        const orderId = "order_" + getRandom5DigitNumber() + "_" + Date.now();
        const payload = {
            order_amount: amount,
            order_currency: currency,
            order_id: orderId,
            customer_details: {
                customer_id: customerData.uid || "guest_" + Date.now(),
                customer_phone: customerData.phone || "9999999999", 
                customer_email: customerData.customer_email || customerData.email || "test@test.com"
            },
            order_meta: {
                return_url: window.location.origin + "/pricing?order_id={order_id}"
            }
        };

        // Note: Direct fetch from frontend involves exposing Secret Key or CORS issues.
        // This is strictly for POC as requested.
        const response = await fetch(`${BASE_URL}/orders`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Order Created:");
            return {
                status: "success",
                payment_session_id: data.payment_session_id,
                order_id: data.order_id,
                data: data
            };
        } else {
            console.error("Cashfree Order Create Error:", data);
            return {
                status: "failed",
                error: data.message || "Failed to create order"
            };
        }
    } catch (error) {
        console.error("Cashfree API Error:", error);
        return { status: "failed", error: error.message };
    }
};

export const fetchPaymentStatus = async (orderId) => {
    try {
        const response = await fetch(`${BASE_URL}/orders/${orderId}/payments`, {
            method: "GET",
            headers: getHeaders()
        });

        const payments = await response.json();
        console.log("Payments Response:", payments);

        if (Array.isArray(payments) && payments.length > 0) {
            // Check for any successful payment
            const successfulPayment = payments.find(p => p.payment_status === "SUCCESS");
            if (successfulPayment) {
                return {
                    status: "success",
                    order_id: successfulPayment.order_id,
                    payment_status: "PAID", // Mapped to PAID for compatibility
                    data: successfulPayment
                };
            }

            // Check for pending
            const pendingPayment = payments.find(p => p.payment_status === "PENDING");
            if (pendingPayment) {
                 return {
                    status: "success",
                    payment_status: "ACTIVE", // Mapped to ACTIVE (Pending)
                    data: pendingPayment
                };
            }

            // Fallback to failed/other
            return {
                status: "success",
                payment_status: payments[0].payment_status,
                data: payments[0]
            };
        } else {
             // No payment attempts found
             return { status: "success", payment_status: "ACTIVE", data: { message: "No payment attempts found" } };
        }
    } catch (error) {
        console.error("Cashfree Fetch Status Error:", error);
        return { status: "failed", error: error.message };
    }
}

export const doPayment = async (paymentSessionId) => {
    if (!cashfree) {
        await initializeCashfree();
    }
    return cashfree.checkout({
        paymentSessionId: paymentSessionId,
        returnUrl: window.location.origin + "/pricing?order_id={order_id}"
    });
};

export const cancelSubscription = async (orderId) => {
    return { status: "success", message: "Not implemented" };
}
