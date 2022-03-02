import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, {
  useEffect,
  useContext,
  useReducer,
} from "react";
import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { getError } from "../../utils/error";
import { Store } from "../../utils/Store";
import Layout from "../../components/Layout";
import useStyles from "../../utils/styles";

function reducer(state, action) {
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
        products: action.payload,
        error: "",
      };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "CREATE_REQUEST":
      return {
        ...state,
        loadingCreate: true,
        createError: "",
      };
    case "CREATE_SUCCESS":
      return {
        ...state,
        loadingCreate: false,
        createError: "",
      };
    case "CREATE_FAIL":
      return {
        ...state,
        loadingCreate: false,
        createError: action.payload,
      };
    case "DELETE_REQUEST":
      return {
        ...state,
        loadingDelete: true,
        deleteError: "",
      };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        deleteError: "",
        successDelete: true,
      };
    case "DELETE_FAIL":
      return {
        ...state,
        loadingDelete: false,
        deleteError: action.payload,
      };
    case "DELETE_RESET":
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };
    default:
      state;
  }
}

function AdminDashboard() {
  const { state } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  const [
    {
      loading,
      error,
      products,
      loadingCreate,
      loadingDelete,
      deleteError,
      createError,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `/api/admin/products`,
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
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (id) => {
    if (
      !window.confirm(
        "Are you sure to delete product"
      )
    ) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      const { data } = await axios.delete(
        `http://localhost:3000/api/admin/products/${id}`,
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      dispatch({ type: "DELETE_SUCCESS" });
      alert("Product delete successful");
    } catch (error) {
      alert(error);
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  const createHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/products",
        {},
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "CREATE_SUCCESS" });
      alert("Create a new Product");
      router.push(
        `/admin/product/${data.product._id}`
      );
    } catch (error) {
      alert(error);
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  return (
    <Layout title='Products'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
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
                <ListItem button component='a'>
                  <ListItemText primary='Orders'></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink
                href='/admin/products'
                passHref
              >
                <ListItem
                  selected
                  button
                  component='a'
                >
                  <ListItemText primary='Products'></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Grid
                  container
                  alignItems='center'
                >
                  <Grid item xs={6}>
                    <Typography
                      component='h1'
                      variant='h1'
                    >
                      Products
                    </Typography>
                    {loadingDelete && (
                      <CircularProgress />
                    )}
                  </Grid>
                  <Grid align='right' item xs={6}>
                    <Button
                      onClick={createHandler}
                      color='primary'
                      variant='contained'
                    >
                      Create
                    </Button>
                    {loadingCreate && (
                      <CircularProgress />
                    )}
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography
                    className={classes.error}
                  >
                    {error}
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            ID
                          </TableCell>
                          <TableCell>
                            NAME
                          </TableCell>
                          <TableCell>
                            PRICE
                          </TableCell>
                          <TableCell>
                            CATEGORY
                          </TableCell>
                          <TableCell>
                            COUNT
                          </TableCell>
                          <TableCell>
                            RATING
                          </TableCell>
                          <TableCell>
                            ACTIONS
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map(
                          (product) => (
                            <TableRow
                              key={product._id}
                            >
                              <TableCell>
                                {product._id.substring(
                                  20,
                                  24
                                )}
                              </TableCell>
                              <TableCell>
                                {product.name}
                              </TableCell>
                              <TableCell>
                                ${product.price}
                              </TableCell>
                              <TableCell>
                                {product.category}
                              </TableCell>
                              <TableCell>
                                {
                                  product.countInStock
                                }
                              </TableCell>
                              <TableCell>
                                {product.rating}
                              </TableCell>
                              <TableCell>
                                <NextLink
                                  href={`/admin/product/${product._id}`}
                                  passHref
                                >
                                  <Button
                                    size='small'
                                    variant='contained'
                                  >
                                    Edit
                                  </Button>
                                </NextLink>{" "}
                                <Button
                                  size='small'
                                  variant='contained'
                                  onClick={() =>
                                    deleteHandler(
                                      product._id
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        )}
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
}

export default dynamic(
  () => Promise.resolve(AdminDashboard),
  { ssr: false }
);
