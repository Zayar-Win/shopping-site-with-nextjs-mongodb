import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, {
  useContext,
  useEffect,
  useReducer,
} from "react";
import Layout from "../../components/Layout";
import { Store } from "../../utils/Store";
import NextLink from "next/link";
import useStyles from "../../utils/styles";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { getError } from "../../utils/error";
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
        summary: action.payload,
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

const AdminDashBoard = () => {
  const router = useRouter();
  const {
    state: { userInfo },
  } = useContext(Store);
  const classes = useStyles();
  const [{ loading, error, summary }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
      summary: {},
    });
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
          "http://localhost:3000/api/admin/summary",
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
        dispatch({
          type: "FETCH_FAIL",
          payload: error,
        });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title='Admin Dashboard'>
      <Grid container spacing={2}>
        <Grid item md={3} xs={12}>
          <Card className={classes.session}>
            <List>
              <NextLink
                href='/admin/orders'
                passHref
              >
                <ListItem component='a' button>
                  <ListItemText primary='Orders'></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink
                href='/admin/dashboard'
                passHref
              >
                <ListItem
                  component='a'
                  button
                  selected
                >
                  <ListItemText primary='Admin Dashboard'></ListItemText>
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
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <p>{error.message}</p>
                ) : (
                  <Grid container spacing={2}>
                    <Grid
                      item
                      md={3}
                      sm={6}
                      xs={12}
                    >
                      <Card reised>
                        <CardContent>
                          <Typography variant='h1'>
                            ${summary.orderPrice}
                          </Typography>
                          <Typography>
                            Sales
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink
                            href='/admin/orders'
                            passHref
                          >
                            <Button
                              color='primary'
                              size='small'
                            >
                              View Sales
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid
                      item
                      md={3}
                      sm={6}
                      xs={12}
                    >
                      <Card reised>
                        <CardContent>
                          <Typography variant='h1'>
                            {summary.orderCount}
                          </Typography>
                          <Typography>
                            Orders
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink
                            href='/admin/orders'
                            passHref
                          >
                            <Button
                              color='primary'
                              size='small'
                            >
                              View Orders
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid
                      item
                      md={3}
                      sm={6}
                      xs={12}
                    >
                      <Card reised>
                        <CardContent>
                          <Typography variant='h1'>
                            {summary.productCount}
                          </Typography>
                          <Typography>
                            Products
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink
                            href='/admin/products'
                            passHref
                          >
                            <Button
                              color='primary'
                              size='small'
                            >
                              View Products
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid
                      item
                      md={3}
                      sm={6}
                      xs={12}
                    >
                      <Card reised>
                        <CardContent>
                          <Typography variant='h1'>
                            {summary.userCount}
                          </Typography>
                          <Typography>
                            Users Count
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink
                            href='/admin/users'
                            passHref
                          >
                            <Button
                              color='primary'
                              size='small'
                            >
                              View Users
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <ListItem>
                <Typography
                  component='h1'
                  variant='h1'
                >
                  Sales Chart
                </Typography>
              </ListItem>
              <ListItem>
                <Bar
                  data={{
                    labels: summary.saleData?.map(
                      (data) => data._id
                    ),
                    datasets: [
                      {
                        label: "Sales",
                        data: summary.saleData?.map(
                          (data) =>
                            data.totalSales
                        ),
                        backgroundColor:
                          "rgba(162, 222, 208, 1)",
                      },
                    ],
                  }}
                ></Bar>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(
  () => Promise.resolve(AdminDashBoard),
  { ssr: false }
);
