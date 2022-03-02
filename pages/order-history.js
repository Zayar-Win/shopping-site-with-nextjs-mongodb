import {
  Button,
  Card,
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
import Layout from "../components/Layout";
import NextLink from "next/link";
import useStyles from "../utils/styles";
import dynamic from "next/dynamic";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import { get } from "react-hook-form";
import axios from "axios";

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
        orders: action.payload,
        error: "",
      };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const OrderHistory = () => {
  const classes = useStyles();
  const {
    state: { userInfo },
  } = useContext(Store);
  const router = useRouter();

  const [{ loading, error, orders }, dispatch] =
    useReducer(reducer, {
      error: "",
      loading: true,
      orders: [],
    });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const res = await axios.get(
            "http://localhost:3000/api/order/history",
            {
              headers: {
                authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          dispatch({
            type: "FETCH_SUCCESS",
            payload: res.data,
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
    }
  }, []);

  return (
    <Layout title='Order History'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.session}>
            <List>
              <NextLink href='/profile' passHref>
                <ListItem button component='a'>
                  <ListItemText primary='Profile'></ListItemText>
                </ListItem>
              </NextLink>
            </List>
            <List>
              <NextLink
                href='/order-history'
                passHref
              >
                <ListItem
                  button
                  component='a'
                  selected
                >
                  <ListItemText primary='Order History'></ListItemText>
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
                  component='h1'
                  variant='h1'
                >
                  Order History
                </Typography>
              </ListItem>
              <ListItem>
                {/* have to conditional */}
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>
                          Date
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
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>
                            {order._id.substring(
                              20,
                              25
                            )}
                          </TableCell>
                          <TableCell>
                            {order.createdAt}
                          </TableCell>
                          <TableCell>
                            {order.totalPrice}
                          </TableCell>
                          <TableCell>
                            {order.isPaid
                              ? `paid at ${order.paidAt}`
                              : "not paid"}
                          </TableCell>
                          <TableCell>
                            {order.isDelevered
                              ? order.deliveredAt
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
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(
  () => Promise.resolve(OrderHistory),
  { ssr: false }
);
