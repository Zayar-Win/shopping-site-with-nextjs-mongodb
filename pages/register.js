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
  useState,
} from "react";
import Layout from "../components/Layout";
import useStyles from "../utils/styles";
import NextLink from "next/link";
import axios from "axios";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const Register = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (state.userInfo) {
      router.push("/");
    }
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password doesn't match!!!!");
      return;
    }
    try {
      const user = await axios.post(
        "/api/user/register",
        { name, email, password, confirmPassword }
      );
      if (user) {
        const newUser = user.data;
        dispatch({
          type: "ADD_USER",
          payload: newUser,
        });
        Cookies.set(
          "userInfo",
          JSON.stringify(newUser)
        );
        router.push(redirect || "/");
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Layout title={"login"}>
      <form
        className={classes.form}
        onSubmit={onSubmitHandler}
      >
        <Typography component='h1' variant='h1'>
          Login Form
        </Typography>
        <List>
          <ListItem>
            <TextField
              fullWidth
              variant='outlined'
              id='name'
              label='Name'
              inputProps={{ type: "text" }}
              onChange={(e) =>
                setName(e.target.value)
              }
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              fullWidth
              variant='outlined'
              id='email'
              label='Email'
              inputProps={{ type: "email" }}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              fullWidth
              variant='outlined'
              id='password'
              label='Password'
              inputProps={{ type: "password" }}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              fullWidth
              variant='outlined'
              id='password'
              label='Password'
              inputProps={{ type: "password" }}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            ></TextField>
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
            Already have an account? &nbsp;{" "}
            <NextLink
              href={`/login?redirect=${
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

export default Register;
