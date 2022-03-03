import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import Layout from "../../components/Layout";
import { Store } from "../../utils/Store";
import NextLink from "next/link";
import Image from "next/image";
import {
  Grid,
  TableContainer,
  Table,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Button,
  Card,
  List,
  ListItem,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import { useRouter } from "next/router";
import useStyles from "../../utils/styles";
import CheckoutWizard from "../../components/CheckoutWizard";
import {
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return {
        ...state,
        loading: true,
        error: "",
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: "",
        order: action.payload,
      };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "PAY_REQUEST":
      return {
        ...state,
        loadingPay: true,
      };
    case "PAY_SUCCESS":
      return {
        ...state,
        loadingPay: false,
        successPay: true,
      };
    case "PAY_FAIL":
      return {
        ...state,
        loadingPay: false,
        errorPay: action.payload,
      };
    case "PAY_RESET":
      return {
        ...state,
        loadingPay: false,
        errorPay: "",
        successPay: false,
      };
    case "DELIVER_REQUEST":
      return {
        ...state,
        deliverLoading: true,
      };
    case "DELIVER_SUCCESS":
      return {
        ...state,
        deliverLoading: false,
        successDeliver: false,
        deliverMessage: action.payload.message,
      };
    case "DELIVER_FAIL":
      return {
        ...state,
        deliverLoading: false,
        deliverError: action.payload,
      };
    case "DELIVER_RESET":
      return {
        ...state,
        deliverLoading: false,
        successDeliver: false,
      };

    default:
      return state;
  }
};

function OrderDetail({ params }) {
  const classes = useStyles();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [
    {
      loading,
      error,
      order,
      successPay,
      deliverLoading,
      successDeliver,
      deliverError,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    order: {},
  });

  const [{ isPending }, paypalDispatch] =
    usePayPalScriptReducer();

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    totalPrice,
    taxPrice,
    shippingPrice,
    itemsPrice,
    isDelivered,
    isPaid,
    deliveredAt,
    paidAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const res = await axios.get(
          `/api/order/${params.id}`,
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        const data = res.data;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error,
        });
        alert(error);
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== params.id)
    ) {
      fetchData();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const res = await axios.get(
          "/api/keys/paypal",
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        const clientId = res.data;
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: "pending",
        });
      };

      loadPaypalScript();
    }
  }, [order, successPay, successDeliver]);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderId) => orderId);
  };
  const onApprove = (data, actions) => {
    actions.order
      .capture()
      .then(async function (datails) {
        try {
          dispatch({ type: "PAY_REQUEST" });
          const { data } = await axios.put(
            `/api/order/${order._id}/pay`,
            datails,
            {
              headers: {
                authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          console.log("pay ment done");
          dispatch({
            type: "PAY_SUCCESS",
            payload: data,
          });
          alert("Order is paid");
        } catch (error) {
          alert(error);
          dispatch({
            type: "PAY_FAIL",
            payload: error,
          });
        }
      });
  };
  const onError = (error) => {
    alert(error);
  };

  const deliverHandler = async (e, id) => {
    e.preventDefault();
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `/api/order/${id}/deliver`,
        {},
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      dispatch({
        type: "DELIVER_SUCCESS",
        payload: data,
      });
      alert("Deliver Success");
    } catch (error) {
      alert(error);
      dispatch({ type: "DELIVER_FAIL" });
    }
  };

  return (
    <Layout title='Order Detail'>
      <CheckoutWizard step={3}></CheckoutWizard>
      <Typography component='h1' variant='h1'>
        Order Detail
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography>{error}</Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography
                    component='h2'
                    variant='h1'
                  >
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress?.username},{" "}
                  {shippingAddress?.address},{" "}
                  {shippingAddress?.city},{" "}
                  {shippingAddress?.postalcode},{" "}
                  {shippingAddress?.country}
                </ListItem>
                <ListItem>
                  <Typography>
                    <strong>Status</strong> &nbsp;
                    {isDelivered
                      ? `Delivered at ${deliveredAt}`
                      : "not deliver yet!"}
                  </Typography>
                </ListItem>
              </List>
            </Card>
            <Card className={classes.session}>
              <List>
                <ListItem>
                  <Typography
                    component='h1'
                    variant='h1'
                  >
                    Payment Method
                  </Typography>
                </ListItem>
                <ListItem>
                  {paymentMethod}
                </ListItem>
                <ListItem>
                  <Typography>
                    <strong>Status</strong>&nbsp;
                    {isPaid
                      ? `Paid at ${paidAt}`
                      : "not paid yet!!"}
                  </Typography>
                </ListItem>
              </List>
            </Card>
            <Card className={classes.session}>
              <List>
                <ListItem>
                  <Typography
                    component='h1'
                    variant='h1'
                  >
                    Order Items
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            Image
                          </TableCell>
                          <TableCell>
                            Name
                          </TableCell>
                          <TableCell align='right'>
                            Quantity
                          </TableCell>
                          <TableCell align='right'>
                            Price
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems?.map(
                          (item) => (
                            <TableRow
                              key={item._id}
                            >
                              <TableCell>
                                <NextLink
                                  href={`/product/${item.slug}`}
                                  passHref
                                >
                                  <Link>
                                    <Image
                                      src={
                                        item.image
                                      }
                                      alt={
                                        item.name
                                      }
                                      width={50}
                                      height={50}
                                    ></Image>
                                  </Link>
                                </NextLink>
                              </TableCell>

                              <TableCell>
                                <NextLink
                                  href={`/product/${item.slug}`}
                                  passHref
                                >
                                  <Link>
                                    <Typography>
                                      {item.name}
                                    </Typography>
                                  </Link>
                                </NextLink>
                              </TableCell>
                              <TableCell align='right'>
                                <Typography>
                                  {item.quantity}
                                </Typography>
                              </TableCell>
                              <TableCell align='right'>
                                <Typography>
                                  ${item.price}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant='h1'>
                    Order Summary
                  </Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        Items
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>
                        ${itemsPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>
                        ${taxPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        Shipping
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>
                        ${shippingPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>
                        <strong>
                          ${totalPrice}
                        </strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!isPaid && !userInfo.is_Admin && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <div
                        className={
                          classes.fullWidth
                        }
                      >
                        <PayPalButtons
                          createOrder={
                            createOrder
                          }
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                  </ListItem>
                )}
                {userInfo.is_Admin && (
                  <ListItem>
                    {deliverLoading && (
                      <CircularProgress />
                    )}
                    {order.isDelivered ? (
                      <Typography
                        color='primary'
                        component='h1'
                        variant='h1'
                      >
                        Already Delivered
                      </Typography>
                    ) : (
                      <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        onClick={(e) =>
                          deliverHandler(
                            e,
                            params.id
                          )
                        }
                      >
                        Deliver Order
                      </Button>
                    )}
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export const getServerSideProps = async ({
  params,
}) => {
  return {
    props: {
      params,
    },
  };
};

export default OrderDetail;
