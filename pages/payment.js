import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import useStyles from "../utils/styles";

const Payment = () => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] =
    useState("");
  const classes = useStyles();
  const {
    state: {
      cart: { shippingAddress },
    },
    dispatch,
  } = useContext(Store);

  useEffect(() => {
    if (!shippingAddress?.address) {
      router.push("/shipping");
    } else {
      const paymentMethod =
        Cookies.get("paymentMethod") || "";
      setPaymentMethod(paymentMethod);
    }
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Payment method is required");
    } else {
      dispatch({
        type: "SAVE_PAYMENT_METHOD",
        payload: paymentMethod,
      });
      Cookies.set("paymentMethod", paymentMethod);
      router.push("/placeorder");
    }
  };

  return (
    <Layout title='Payment Method'>
      <CheckoutWizard step={2}></CheckoutWizard>
      <form
        className={classes.form}
        onSubmit={submitHandler}
      >
        <Typography variant='h1' component='h1'>
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component='fieldset'>
              <RadioGroup
                aria-label='Payment Method'
                name='paymentmethod'
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              >
                <FormControlLabel
                  value='Paypal'
                  label='Paypal'
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  value='Stripe'
                  label='Stripe'
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  value='Cash'
                  label='Cash'
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type='submit'
              variant='contained'
              color='primary'
            >
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant='contained'
              onClick={() =>
                router.push("/shipping")
              }
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Payment;
