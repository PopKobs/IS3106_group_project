import { PayPalButtons } from "@paypal/react-paypal-js";

const PaypalPayment = () => {

    const serverUrl = "http://localhost:8888";

    const createOrder = (data) => {
        const storedCartItems = sessionStorage.getItem('cartItems');
        const cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
        let totalPrice = 0;

        cartItems.forEach(item => {
            totalPrice += item.quantity * item.unitPrice;
        });
        
        const orderDetails = {
            cart: cartItems.map(item => ({
              itemId: item.id,
              title: item.title,
              description: item.description,
              price: item.unitPrice.toString(),
              quantity: item.quantity.toString(),
              totalPrice: (item.unitPrice * item.quantity).toString()
            })),
            totalPayment: totalPrice.toString()
          };

        // Order is created on the server and the order id is returned
        return fetch(`${serverUrl}/my-server/create-paypal-order`, {
          method: "POST",
           headers: {
            "Content-Type": "application/json",
          },
          // use the "body" param to optionally pass additional order information
          // like product skus and quantities
          body: JSON.stringify(orderDetails),
        })
        .then((response) => response.json())
        .then((order) => order.id);
      };

      const onApprove = (data) => {
         // Order is captured on the server and the response is returned to the browser
         return fetch(`${serverUrl}/my-server/capture-paypal-order`, {
          method: "POST",
           headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderID: data.orderID
          })
        })
        .then((response) => response.json());
      };

    return (
        <PayPalButtons
            createOrder={(data, actions) => createOrder(data, actions)}
            onApprove={(data, actions) => onApprove(data, actions)}
        />
    );

}

export default PaypalPayment;