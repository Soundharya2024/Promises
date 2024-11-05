document.addEventListener("DOMContentLoaded", () => {
    const cart = [
        {
            item: "shoes",
            price: 2000
        },
        {
            item: "socks",
            price: 100
        }, 
        {
            item: "jeans",
            price: 1000
        }, 
        {
            item: "t-shirt",
            price: 200
        }
    ];

    let orderSummary = [];
    let walletBalance = 5000;

    createOrder(cart, orderSummary)
        .then(function(orderId) {
            console.log("order created");
            document.querySelector(".main-container").innerHTML = `<p>Order created successfully with Order Id: ${orderId}</p>`;
            return orderSummary;
        })
        .catch(function(cartErr) {
            console.log("order creation failed");
            document.querySelector(".main-container").innerHTML = `<p>Order creation failed with error: ${cartErr.message}</p>`;
        })
        .then(function(orderSummary) {
            console.log("proceedToPayment promise called");
            document.querySelector(".main-container").innerHTML += "<p>Proceeding to payment</p>";
            return proceedToPayment(orderSummary, walletBalance);
        })
        .then(function(paymentInfo){
            console.log("confirmDialog promise called");
            return confirmDialog(`Total amount to be paid: ₹${paymentInfo[0]}\nAvailable Payment Method: Wallet\nProceed to payment?`, paymentInfo);
        })
        .catch(function(permissionErr) {
            console.log("updateWallet error");
            document.querySelector(".main-container").innerHTML += `<p>${permissionErr}</p>`;
        })
        .then(function(paymentInfo){
            console.log("updateWallet promise called");
            return updateWallet(paymentInfo, orderSummary);
        })
        .then(function(paymentSuccessAndOrderInfo) {
            console.log("Payment Successful");
            document.querySelector(".main-container").innerHTML += paymentSuccessAndOrderInfo[0];
            return paymentSuccessAndOrderInfo[1];
        })
        .catch(function(err) {
            console.log("Payment Error");
            document.querySelector(".main-container").innerHTML += `<p>Payment unsuccessful with error: ${err.message}</p>`;
        })
        .then(function(orderSummary) {
            console.log("Show Order Summary");
            const currentOrder = orderSummary[orderSummary.length - 1];
            document.querySelector(".main-container").innerHTML += `<h5 class="text-center fw-bold">Order Summary</h5><h6 class="fw-semibold">Order Id: ${currentOrder.orderId}</h6><table class="order-summary-table table table-bordered border-black"><thead><tr><th class="fw-semibold">Item</th><th class="fw-semibold">Price</th></tr></thead><tbody></tbody></table>`;
            currentOrder.orderDetails.map((order_item) => {
                const current_row = document.createElement("tr");
                current_row.innerHTML = `<td>${order_item.item}</td><td>₹${order_item.price}</td>`;
                document.querySelector(".main-container .order-summary-table tbody").appendChild(current_row);
            });
            document.querySelector(".main-container .order-summary-table tbody").innerHTML += `<tr><td class="fw-medium">Total</td><td class="fw-medium">₹${currentOrder.orderTotal}</td></tr>`;
        })
        .catch(function(err) {
            console.log("Order placement failed");
            document.querySelector(".main-container").innerHTML += `<p>Order placement failed with error: ${err.message}</p>`;
        })
});

function createOrder(cart, orderSummary) {
    console.log("createOrder()");
    const pr = new Promise(function(resolve, reject) {
        if(!validateCart(cart))
        {
            const cartErr = new Error("Cart not valid");
            console.log("createOrder rejected");
            reject(cartErr);
        }

        //When cart is valid
        const orderId = Math.floor((Math.random() * 100000) + 1);
        const orderDetails = cart;
        orderTotal = calcOrderTotal(cart);

        orderSummary.push({"orderId": orderId, "orderDetails": orderDetails, "orderTotal": orderTotal});

        if(orderId){
            console.log("createOrder resolved");
            resolve(orderId);
        }
    });
    return pr;
}

function validateCart(cart) {
    console.log("validateCart()");
    return cart.length > 0;
}

const calcOrderTotal = (cart) => {
    console.log("calcOrderTotal()");

    let cartTotal;
    cartTotal = cart.reduce((acc, currItem) => {
        acc += currItem.price;
        return acc;
    }, 0);

    return cartTotal;
};

function proceedToPayment(orderSummary, walletBalance) {
    console.log("proceedToPayment()");
    const pr = new Promise(function(resolve){
        const amountPayable = orderSummary[orderSummary.length - 1].orderTotal;
        const paymentInfo = [amountPayable, walletBalance];
        resolve(paymentInfo);
    });
    return pr;
}

function confirmDialog(message, paymentInfo) {
    return new Promise((resolve, reject) => {
        if (window.confirm(message)) {
            resolve(paymentInfo); // User clicked OK
        } else {
            const permissionErr = new Error("Permission to access wallet denied by user");
            reject(permissionErr); // User clicked Cancel
        }
    });
}

function updateWallet(paymentInfo, orderSummary) {
    return new Promise((resolve, reject) => {
        const amountPayable = paymentInfo[0];
        let walletBalance = paymentInfo[1];
        if(checkWalletBalance(walletBalance, amountPayable)) {
            walletBalance = walletBalance - amountPayable;
            const paymentSuccessAndOrderInfo = [`<p>Payment Successful!</p><p>Amount paid: ₹${amountPayable}</p><p>Wallet Balance: ₹${walletBalance}</p>`, orderSummary];
            resolve(paymentSuccessAndOrderInfo);
        } else {
            const walletErr = new Error("Wallet Balance insufficient");
            reject(walletErr);
        }
    });
}

function checkWalletBalance(walletBalance, amountPayable) {
    console.log("checkWalletBalance()");
    return amountPayable <= walletBalance;
}