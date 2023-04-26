import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });

  useEffect(() => {
    const timerId = setInterval(() => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);
  if (timeLeft < 0) {
    return (
      <div className="w-[80%] mx-auto">
        <div>Order Expired</div>
      </div>
    );
  }
  return (
    <div className="w-[80%] mx-auto">
      <div>{timeLeft} seconds left until order expires</div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51Mzh1SSCytVSzppJzTUZaIG9st7VnFLah5AlGShfp1eSp6wqRz8uL674LztKqZSGUAUqH5pQcxwy2buFMHEbon19001tDD5h3B"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId.slice(0, -1)}`);
  return { order: data };
};

export default OrderShow;
