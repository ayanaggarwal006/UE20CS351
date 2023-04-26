const OrderIndex = ({ orders }) => {
  return (
    <div className="w-[80%] mx-auto">
      <h1 className="text-3xl font-bold mt-4 mb-2">My Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrderIndex;
