import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import Layout from "../../../components/Layout";
import NextLink from "next/link";
import {
  Controller,
  set,
  useForm,
} from "react-hook-form";
import useStyles from "../../../utils/styles";
import {
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Store } from "../../../utils/Store";
import { useRouter } from "next/router";
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
        error: "",
      };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "UPDATE_REQUEST":
      return {
        ...state,
        updateLoading: true,
        updateError: "",
      };
    case "UPDATE_SUCCESS":
      return {
        ...state,
        updateLoading: false,
        updateError: "",
      };
    case "UPDATE_FAIL":
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload,
      };
    default:
      return state;
  }
};

const EditProduct = ({ params }) => {
  const classes = useStyles();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const {
    state: { userInfo },
  } = useContext(Store);
  const router = useRouter();
  const [product, setProduct] = useState(null);

  const [
    {
      loading,
      error,
      updateError,
      updateLoading,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    if (!userInfo.is_Admin) {
      router.push("/");
    }
    const fetchData = async (req, res) => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `/api/admin/products/${params.id}`,
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setProduct(data);
        dispatch({ type: "FETCH_SUCCESS" });

        setValue("name", data.name);
        setValue("slug", data.slug);
        setValue("category", data.category);
        setValue("brand", data.brand);
        setValue("image", data.image);
        setValue("price", data.price);
        setValue(
          "countInStock",
          data.countInStock
        );
        setValue("description", data.description);
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

  const submitHandler = async ({
    name,
    slug,
    category,
    brand,
    image,
    price,
    countInStock,
    description,
  }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axios.put(
        `/api/admin/products/${params.id}`,
        {
          name,
          slug,
          category,
          brand,
          image,
          price,
          countInStock,
          description,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      router.push("/admin/products");
    } catch (error) {
      alert(error);
      dispatch({
        type: "UPDATE_FAIL",
        payload: error,
      });
    }
  };

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("upload_preset", "uploads");
    const uploadRes = await axios.post(
      "https://api.cloudinary.com/v1_1/dparjcr9c/image/upload",
      formdata
    );
    alert(
      "Upload image success please update the product"
    );
    const { url } = uploadRes.data;
    setValue("image", url);
  };

  return (
    <Layout title={`Edit ${params.id}`}>
      <Grid container spacing={2}>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <NextLink
                href='/admin/dashboard'
                passHref
              >
                <ListItem component='a' button>
                  <ListItemText primary='Admin Dashboard'></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink
                href='/admin/orders'
                passHref
              >
                <ListItem component='a' button>
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
          <Card>
            <List>
              <ListItem>
                <Typography
                  component='h1'
                  variant='h1'
                  color='primary'
                >
                  Edit {product?.name}
                </Typography>
              </ListItem>
              <ListItem>
                <form
                  className={classes.form}
                  onSubmit={handleSubmit(
                    submitHandler
                  )}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name='name'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            id='productname'
                            fullWidth
                            variant='outlined'
                            label='ProductName'
                            inputProps={{
                              type: "text",
                            }}
                            error={Boolean(
                              errors.name
                            )}
                            helperText={
                              errors.name
                                ? "Product Name is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='slug'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            id='slug'
                            fullWidth
                            variant='outlined'
                            label='Slug'
                            inputProps={{
                              type: "text",
                            }}
                            error={Boolean(
                              errors.slug
                            )}
                            helperText={
                              errors.slug
                                ? "Slug is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='category'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            id='Category'
                            fullWidth
                            variant='outlined'
                            label='Category'
                            inputProps={{
                              type: "text",
                            }}
                            error={Boolean(
                              errors.category
                            )}
                            helperText={
                              errors.category
                                ? "Category is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='image'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            id='image'
                            fullWidth
                            variant='outlined'
                            label='Image'
                            inputProps={{
                              type: "text",
                            }}
                            error={Boolean(
                              errors.image
                            )}
                            helperText={
                              errors.image
                                ? "Image is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button
                        component='label'
                        variant='contained'
                      >
                        Upload Image
                        <input
                          type='file'
                          onChange={(e) =>
                            uploadHandler(e)
                          }
                          hidden
                        ></input>
                      </Button>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='price'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            id='price'
                            fullWidth
                            variant='outlined'
                            label='Price'
                            inputProps={{
                              type: "text",
                            }}
                            error={Boolean(
                              errors.price
                            )}
                            helperText={
                              errors.price
                                ? "Price is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='brand'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            id='brand'
                            fullWidth
                            variant='outlined'
                            label='Brand'
                            inputProps={{
                              type: "text",
                            }}
                            error={Boolean(
                              errors.brand
                            )}
                            helperText={
                              errors.brand
                                ? "Brand is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='countInStock'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            id='countInStock'
                            fullWidth
                            variant='outlined'
                            label='CountInStock'
                            inputProps={{
                              type: "text",
                            }}
                            error={Boolean(
                              errors.countInStock
                            )}
                            helperText={
                              errors.countInStock
                                ? "CountInStock is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='description'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            id='descripton'
                            fullWidth
                            variant='outlined'
                            label='Description'
                            inputProps={{
                              type: "text",
                            }}
                            error={Boolean(
                              errors.description
                            )}
                            helperText={
                              errors.description
                                ? "Description is required"
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
                        type='submit'
                        color='primary'
                        variant='contained'
                      >
                        Update
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps = async ({
  params,
}) => {
  return {
    props: {
      params,
    },
  };
};

export default EditProduct;
