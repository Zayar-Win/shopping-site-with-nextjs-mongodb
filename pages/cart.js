import {
  Grid,
  Link,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  MenuItem,
  Button,
  Card,
  List,
  ListItem,
} from "@material-ui/core";
import React, { useContext } from "react";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";

function Cart() {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;
  const router = useRouter();

  console.log(cartItems);

  const cartChangeHandler = async (
    item,
    quantity
  ) => {
    const res = await axios.get(
      "http://localhost:3000/api/products/" +
        item.slug
    );
    if (res.data.countInStock < quantity) {
      alert("Sorry,this product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const deleteCartItem = (item) => {
    dispatch({
      type: "CART_REMOVE_ITEM",
      payload: { item },
    });
  };

  const clickHandler = () => {
    router.push("/shipping");
  };

  return (
    <Layout>
      <Typography component='h1' variant='h1'>
        Products
      </Typography>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. &nbsp;
          <NextLink href='/' passHref>
            <Link>Go shopping</Link>
          </NextLink>
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align='right'>
                    Quantity
                  </TableCell>
                  <TableCell align='right'>
                    Price
                  </TableCell>
                  <TableCell align='right'>
                    Action
                  </TableCell>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <NextLink
                          href={`http://localhost:3000/product/${item.slug}`}
                          passHref
                        >
                          <Link>
                            <Image
                              src={item.image}
                              width={50}
                              height={50}
                              alt={item.name}
                            ></Image>
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell>
                        <NextLink
                          href={`/product/${item.slug}`}
                          passHref
                        >
                          <Link>{item.name}</Link>
                        </NextLink>
                      </TableCell>
                      <TableCell align='right'>
                        <Select
                          value={item.quantity}
                          onChange={(e) =>
                            cartChangeHandler(
                              item,
                              e.target.value
                            )
                          }
                        >
                          {[
                            ...Array(
                              item.countInStock
                            ).keys(),
                          ].map((x) => (
                            <MenuItem
                              key={x + 1}
                              value={x + 1}
                            >
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography>
                          {item.price}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Button
                          variant='contained'
                          color='secondary'
                          onClick={() =>
                            deleteCartItem(item)
                          }
                        >
                          X
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography>
                    Subtotal (
                    {cartItems.reduce(
                      (a, c) => a + c.quantity,
                      0
                    )}{" "}
                    items) : $
                    {cartItems.reduce(
                      (a, c) =>
                        a + c.quantity * c.price,
                      0
                    )}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => clickHandler()}
                    fullWidth
                  >
                    Checkout Now
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export default dynamic(
  () => Promise.resolve(Cart),
  { ssr: false }
);
