
export const createPaymentIntent = async (amount, currency = "INR") => {
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve({
            status: "success",
            payment_session_id: "dummy_session_" + Date.now(),
            order_id: "order_" + Date.now(),
            data: {
                payment_token: "dummy_token_" + Date.now()
            }
        })
    }, 1000);
  });
};

export const fetchPaymentStatus = async (orderId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: "success",
                order_id: orderId,
                payment_status: "PAID",
                data: {
                    message: "Payment successfully captured"
                }
            })
        }, 1000);
      });
}

export const cancelSubscription = async (orderId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: "success",
                message: "Subscription cancelled successfully"
            })
        }, 1000);
    });
}
