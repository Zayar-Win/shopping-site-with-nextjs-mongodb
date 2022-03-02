import {
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Controller,
  useForm,
} from "react-hook-form";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import useStyles from "../utils/styles";

const Shipping = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const router = useRouter();
  const {
    state: {
      userInfo,
      cart: { shippingAddress },
    },
    dispatch,
  } = useContext(Store);
  const classes = useStyles();

  useEffect(() => {
    console.log("hit");
    if (!userInfo) {
      router.push("/login?redirect=/shipping");
    }

    setValue(
      "username",
      shippingAddress?.username
    );
    setValue("address", shippingAddress?.address);
    setValue(
      "postalcode",
      shippingAddress?.postalcode
    );
    setValue("city", shippingAddress?.city);
    setValue("country", shippingAddress?.country);
  }, []);

  const submitHandler = ({
    username,
    address,
    postalcode,
    city,
    country,
  }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        username,
        address,
        postalcode,
        city,
        country,
      },
    });
    Cookies.set(
      "shippingAddress",
      JSON.stringify({
        username,
        address,
        postalcode,
        city,
        country,
      })
    );
    router.push("/payment");
  };

  return (
    <Layout title='Shipping Address'>
      <CheckoutWizard step={1}></CheckoutWizard>
      <form
        className={classes.form}
        onSubmit={handleSubmit(submitHandler)}
      >
        <Typography component='h1' variant='h1'>
          Shipping Address
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='username'
              defaultValue=''
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField
                  id='usename'
                  label='User Name'
                  inputProps={{ type: "text" }}
                  fullWidth
                  variant='outlined'
                  error={Boolean(errors.username)}
                  helperText={
                    errors.username
                      ? "User Name is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name='address'
              control={control}
              defaultValue=''
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant='outlined'
                  id='address'
                  label='Address'
                  inputProps={{ type: "text" }}
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? "Address is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name='postalcode'
              defaultValue=''
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField
                  id='postalcode'
                  label='PostalCode'
                  inputProps={{ type: "text" }}
                  fullWidth
                  variant='outlined'
                  error={Boolean(
                    errors.postalcode
                  )}
                  helperText={
                    errors.postalcode
                      ? "PostalCode is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name='city'
              defaultValue=''
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField
                  id='city'
                  label='City'
                  inputProps={{ type: "text" }}
                  fullWidth
                  variant='outlined'
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? "City is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name='country'
              defaultValue=''
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField
                  id='country'
                  label='Country'
                  inputProps={{ type: "text" }}
                  fullWidth
                  variant='outlined'
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? "Country is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant='contained'
              type='submit'
              color='primary'
            >
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Shipping;
