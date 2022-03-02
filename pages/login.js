import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, {
  useContext,
  useEffect,
} from "react";
import Layout from "../components/Layout";
import useStyles from "../utils/styles";
import NextLink from "next/link";
import axios from "axios";
import { Store } from "../utils/Store";
import {
  Controller,
  useForm,
} from "react-hook-form";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const Login = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { redirect } = router.query;
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmitHandler = async (
    { email, password },
    e
  ) => {
    e.preventDefault();
    try {
      const user = await axios.post(
        "http://localhost:3000/api/user/login",
        { email, password }
      );
      if (user) {
        const newUser = user.data;
        dispatch({
          type: "USER_LOGIN",
          payload: newUser,
        });
        Cookies.set(
          "userInfo",
          JSON.stringify(newUser)
        );

        router.push(redirect || "/");
      }
    } catch (error) {
      alert(
        error
          ? error.response.data.message
          : error
      );
    }
  };
  useEffect(() => {
    if (state.userInfo) {
      router.push("/");
    }
  }, []);

  return (
    <Layout title={"login"}>
      <form
        className={classes.form}
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Typography component='h1' variant='h1'>
          Login Form
        </Typography>
        <List>
          <ListItem>
            <Controller
              control={control}
              name='email'
              defaultValue=''
              rules={{
                required: true,
                pattern:
                  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant='outlined'
                  id='email'
                  label='Email'
                  inputProps={{ type: "email" }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type ===
                        "pattern"
                        ? "Email is not valid"
                        : "Email is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name='password'
              control={control}
              rules={{
                required: true,
                minLength: 5,
              }}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant='outlined'
                  id='password'
                  label='Password'
                  inputProps={{
                    type: "password",
                  }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type ===
                        "minLength"
                        ? "Password should have more than five"
                        : "Password is required"
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
              color='primary'
              variant='contained'
              type='submit'
            >
              Login
            </Button>
          </ListItem>
          <ListItem>
            Don't have an account? &nbsp;{" "}
            <NextLink
              href={`/register?redirect=${
                redirect ? redirect : "/"
              }`}
              passHref
            >
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Login;
