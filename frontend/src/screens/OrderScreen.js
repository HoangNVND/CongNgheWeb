import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./../components/Header";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, payOrder } from "../Redux/Actions/OrderActions";
import Loading from "./../components/LoadingError/Loading";
import Message from "./../components/LoadingError/Error";
import { moment } from "moment";
import { ORDER_PAY_RESET } from "../Redux/Constants/OrderConstants";
import axios from "axios";
const OrderScreen = ({ match }) => {
  window.scrollTo(0, 0);

  const [sdkReady, setSdkReady] = useState(false);
  const orderId = match.params.id;
  console.log(match.params);
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(3);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    order.shippingPrice = addDecimals(order.itemsPrice > 100 ? 0 : 0);
    order.taxPrice = addDecimals(Number((0.1 * order.itemsPrice).toFixed(3)));
    order.totalPrice = (
      Number(order.itemsPrice) +
      Number(order.shippingPrice) +
      Number(order.taxPrice)
    ).toFixed(3);
  }

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (!order || successPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId, successPay, order]);
  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };
  return (
    <>
      <Header />
      <div className="container">
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            <div className="row  order-detail">
              <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                <div className="row">
                  <div className="col-md-4 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                  <div className="col-md-8 center">
                    <h5>
                      <strong>Kh??ch H??ng</strong>
                    </h5>
                    <p>{order.user.name}</p>
                    <p>
                      <a href={`mailto:${order.user.email}`}>
                        {order.user.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              {/* 2 */}
              <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                <div className="row">
                  <div className="col-md-4 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-truck-moving"></i>
                    </div>
                  </div>
                  <div className="col-md-8 center">
                    <h5>
                      <strong>Th??ng Tin</strong>
                    </h5>
                    <p>V???n chuy???n : {order.shippingAddress.country}</p>
                    <p>H??nh th???c Thanh To??n: {order.paymentMethod}</p>
                    {order.isPaid ? (
                      <div className="bg-info p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Thanh To??n{moment(order.paidAt).calendar()}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-danger p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Ch??a Thanh To??n
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* 3 */}
              <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                <div className="row">
                  <div className="col-md-4 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                  </div>
                  <div className="col-md-8 center">
                    <h5>
                      <strong>Chuy???n t???i</strong>
                    </h5>
                    <p>
                      {" "}
                      ?????a ch??? :{order.shippingAddress.city},{" "}
                      {order.shippingAddress.address}, M?? b??u ??i???n :
                      {order.shippingAddress.postalCode}
                    </p>
                    {order.isDelivered ? (
                      <div className="bg-info p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          V???n Chuy???n :{moment(order.deliveredAt).calendar()}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-danger p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Kh??ng Th??nh C??ng
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row order-products justify-content-between">
              <div className="col-lg-8">
                {order.orderItems.length === 0 ? (
                  <Message variant="alert-info mt-5">
                    Gi??? H??ng Tr???ng R???ng
                  </Message>
                ) : (
                  <>
                    {order.orderItems.map((item, index) => (
                      <div className="order-product row" key={index}>
                        <div className="col-md-3 col-6">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="col-md-5 col-6 d-flex align-items-center">
                          <Link to={`/products/${item.product}`}>
                            <h6>{item.name}</h6>
                          </Link>
                        </div>
                        <div className="mt-3 mt-md-0 col-md-2 col-6  d-flex align-items-center flex-column justify-content-center ">
                          <h4>S??? L?????NG</h4>
                          <h6>{item.qty}</h6>
                        </div>
                        <div className="mt-3 mt-md-0 col-md-2 col-6 align-items-end  d-flex flex-column justify-content-center ">
                          <h4>TH??NH TI???N</h4>
                          <h6>{item.qty * item.price} 000</h6>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              {/* total */}
              <div className="col-lg-3 d-flex align-items-end flex-column mt-5 subtotal-order">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td>
                        <strong>S???n Ph???m</strong>
                      </td>
                      <td>{order.itemsPrice} VND</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Ph?? V???n Chuy???n</strong>
                      </td>
                      <td>{order.shippingPrice} VND</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Thu???</strong>
                      </td>
                      <td>{order.taxPrice} VND</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Th??nh Ti???n</strong>
                      </td>
                      <td>{order.totalPrice} VND</td>
                    </tr>
                  </tbody>
                </table>
                {!order.isPaid && (
                  <div className="col-12">
                    {loadingPay && <Loading />}
                    {sdkReady ? (
                      <Loading />
                    ) : (
                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OrderScreen;
