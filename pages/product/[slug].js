import React, {
  useEffect,
  useReducer,
  useState,
} from "react";
import Layout from "../../components/Layout";
import NextLink from "next/link";
import Image from "next/image";
import {
  Grid,
  Link,
  ListItem,
  List,
  Typography,
  Card,
  Button,
  TextField,
} from "@material-ui/core";
import useStyles from "../../utils/styles";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../../utils/Store";
import { Rating } from "@material-ui/lab";
import db from "../../utils/db";
import Product from "../../models/Product";

const reducer = (state, action) => {
  switch (action.type) {
    case "SUBMIT_REVIEW_REQUEST":
      return {
        ...state,
        reviewLoading: true,
        error: "",
      };
    case "SUBMIT_REVIEW_SUCCESS":
      return {
        ...state,
        reviewLoading: false,
      };
    case "SUBMIT_REVIEW_FAIL":
      return {
        ...state,
        reviewLoading: false,
        reviewError: action.payload,
      };
    default:
      return state;
  }
};

const ProductDetail = ({ product }) => {
  const classes = useStyles();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const {
    state: { userInfo },
  } = useContext(Store);
  const [
    { reviewLoading, reviewError },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    reviews: [],
  });
  const clickHandler = async (product) => {
    const res = await axios.get(
      "/api/products/" + product.slug
    );

    const existItem = state.cart.cartItems.find(
      (item) => item._id === product._id
    );
    const quantity = existItem
      ? existItem.quantity + 1
      : 1;
    console.log(res);
    if (res.data.countInStock < quantity) {
      window.alert(
        "Sorry,Product is out of instock!!"
      );
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `/api/products/${product._id}/review`
      );
      setReviews(data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    console.log("hit");
    fetchReviews();
  }, []);

  const submitHandler = async () => {
    if (!comment) {
      alert("Please type a comment");
      return;
    }
    try {
      dispatch({ type: "SUBMIT_REVIEW_REQUEST" });
      const { data } = await axios.post(
        `/api/products/${product._id}/review`,
        {
          rating,
          comment,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({
        type: "SUBMIT_REVIEW_SUCCESS",
        payload: data,
      });

      alert("Thank for review");
    } catch (error) {
      dispatch({ type: "SUBMIT_REVIEW_FAIL" });
      alert(error);
    }
  };

  return (
    <Layout title={product.name}>
      <div className={classes.session}>
        <NextLink href='/' passHref>
          <Link>
            <Typography>
              Back To Product
            </Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            width={600}
            height={640}
            alt={product.name}
            layout='responsive'
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography
                component='h1'
                variant='h1'
              >
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant='h6'>
                Category: {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant='h6'>
                Brand: {product.brand}
              </Typography>
            </ListItem>
            <ListItem>
              <Rating
                value={product.rating}
                readOnly
              ></Rating>
              <Link>
                <Typography>
                  ({product.numReviews} reviews)
                </Typography>
              </Link>
            </ListItem>
            <ListItem>
              <Typography variant='h6'>
                Description: {product.description}
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant='h6'>
                      Price
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='h6'>
                      ${product.price}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={5}>
                    <Typography variant='h6'>
                      Status
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant='h6'>
                      {product.countInStock > 0
                        ? "In stock"
                        : "Unaviable"}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <NextLink href='/cart' passHref>
                  <Button
                    fullWidth
                    color='primary'
                    variant='contained'
                    onClick={() =>
                      clickHandler(product)
                    }
                  >
                    <Typography>
                      Add to Card
                    </Typography>
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
      <List>
        <ListItem>
          <Typography component='h1' variant='h1'>
            Customer Reviews
          </Typography>
        </ListItem>
        {reviews.length === 0 && (
          <ListItem>No review</ListItem>
        )}
        {reviews.map((review) => (
          <ListItem key={review._id}>
            <Grid container>
              <Grid
                item
                className={classes.reviewItem}
              >
                <Typography>
                  <strong>{review.name}</strong>
                </Typography>
                <Typography>
                  {review.createdAt.substring(
                    0,
                    10
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Rating
                  value={review.rating}
                  readOnly
                ></Rating>
                <Typography>
                  {review.comment}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
        <ListItem>
          {userInfo ? (
            <form
              className={classes.reviewForm}
              onSubmit={submitHandler}
            >
              <List>
                <ListItem>
                  <TextField
                    multiline
                    variant='outlined'
                    fullWidth
                    name='review'
                    label='Enter Comment'
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                  ></TextField>
                </ListItem>
                <ListItem>
                  <Rating
                    name='simple-controlled'
                    value={rating}
                    onChange={(e) =>
                      setRating(e.target.value)
                    }
                  />
                </ListItem>
                <ListItem>
                  <Button
                    fullWidth
                    color='primary'
                    variant='contained'
                    type='submit'
                  >
                    Submit
                  </Button>
                </ListItem>
              </List>
            </form>
          ) : (
            <NextLink href='/login' passHref>
              <Typography component='h1'>
                Please{" "}
                <Link
                  style={{ cursor: "pointer" }}
                >
                  Login
                </Link>{" "}
                to Review product
              </Typography>
            </NextLink>
          )}
        </ListItem>
      </List>
    </Layout>
  );
};

export default ProductDetail;

export const getServerSideProps = async (
  context
) => {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne(
    { slug },
    "-reviews"
  ).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
};
