import { load } from '@cashfreepayments/cashfree-js';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirebaseApp } from "./firebase_helper";

let cashfree;
export const initializeCashfree = async () => {
    const mode = process.env.REACT_APP_CASHFREE_ENV || "sandbox";
    console.log("[Cashfree] Initializing in mode:", mode);
    cashfree = await load({
        mode: mode
    });
};

export const createPaymentIntent = async (planId, currency = "INR", customerData) => {
    try {
        const functions = getFunctions(getFirebaseApp());
        const createPaymentOrder = httpsCallable(functions, 'createPaymentOrder');

        const returnUrl = window.location.origin + "/pricing?order_id={order_id}";

        const result = await createPaymentOrder({
            planId,
            currency,
            customerData,
            returnUrl
        });

        console.log("[Cashfree] Payment Order Result:", result);

        const data = result.data;

        if (data.status === "success") {
            return {
                status: "success",
                payment_session_id: data.payment_session_id,
                order_id: data.order_id,
                data: data.data
            };
        } else {
            return {
                status: "failed",
                error: data.message || "Failed to create order"
            };
        }

    } catch (error) {
        console.error("Cashfree API Error (Backend):", error);
        return { status: "failed", error: error.message };
    }
};

export const fetchPaymentStatus = async (orderId) => {
    try {
        const functions = getFunctions(getFirebaseApp());
        const verifyPaymentStatus = httpsCallable(functions, 'verifyPaymentStatus');

        const result = await verifyPaymentStatus({ orderId });
        const data = result.data;
        return data;

    } catch (error) {
        console.error("Cashfree Fetch Status Error (Backend):", error);
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
