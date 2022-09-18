import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import React, {
  useContext,
  useEffect,
  useReducer,
} from "react";
import Layout from "../../components/Layout";
import useStyles from "../../utils/styles";
import NextLink from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Store } from "../../utils/Store";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        orders: action.payload,
      };
    case "FETCH_FAIL":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

const OrderAdmin = () => {
  const classes = useStyles();
  const router = useRouter();
  const {
    state: { userInfo },
  } = useContext(Store);
  const [{ loading, error, orders }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
      orders: [],
    });

  console.log(orders);

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    if (!userInfo.is_Admin) {
      router.push("/");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          "/api/admin/orders",
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        dispatch({
          type: "FETCH_SUCCESS",
          payload: data,
        });
      } catch (error) {
        alert(error);
        dispatch({
          type: "FETCH_FAIL",
          payload: error,
        });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title='Orders'>
      <Grid container spacing={2}>
        <Grid item md={3} xs={12}>
          <Card className={classes.session}>
            <List>
              <NextLink
                href='/admin/dashboard'
                passHref
              >
                <ListItem button component='a'>
                  <ListItemText primary='Admin Dashboard'></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink
                href='/admin/orders'
                passHref
              >
                <ListItem
                  button
                  component='a'
                  selected
                >
                  <ListItemText primary='Orders'></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink
                href='/admin/products'
                passHref
              >
                <ListItem component='a' button>
                  <ListItemText primary='Products'></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.session}>
            <List>
              <ListItem>
                <Typography
                  variant='h1'
                  component='h1'
                >
                  Orders
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <p>{error.data}</p>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            ID
                          </TableCell>
                          <TableCell>
                            USER
                          </TableCell>
                          <TableCell>
                            DATE
                          </TableCell>
                          <TableCell>
                            TOTAL
                          </TableCell>
                          <TableCell>
                            PAID
                          </TableCell>
                          <TableCell>
                            DELIVERED
                          </TableCell>
                          <TableCell>
                            ACTION
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders?.map((order) => (
                          <TableRow
                            key={order._id}
                          >
                            <TableCell>
                              {order._id.substring(
                                20,
                                24
                              )}
                            </TableCell>
                            <TableCell>
                              {order.user?.name}
                            </TableCell>
                            <TableCell>
                              {order.createdAt}
                            </TableCell>
                            <TableCell>
                              {order.totalPrice}
                            </TableCell>
                            <TableCell>
                              {order.isPaid
                                ? "Paid"
                                : "not paid"}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? "Delivered"
                                : "not delivered"}
                            </TableCell>
                            <TableCell>
                              <NextLink
                                href={`/order/${order._id}`}
                                passHref
                              >
                                <Button variant='contained'>
                                  Details
                                </Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(
  () => Promise.resolve(OrderAdmin),
  { ssr: false }
);
