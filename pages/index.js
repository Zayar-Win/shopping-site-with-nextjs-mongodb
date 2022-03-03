import { Grid } from "@material-ui/core";
import Layout from "../components/Layout";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import ProductItem from "../components/ProductItem";

export default function Home({ products }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const onClickHandler = async (product) => {
    const res = await axios.get(
      "http://localhost:3000/api/products/" +
        product.slug
    );
    const exitItem = state.cart.cartItems.find(
      (item) => item._id === product._id
    );
    const quantity = exitItem
      ? exitItem.quantity + 1
      : 1;
    if (res.data.countInStock < quantity) {
      window.alert(
        "Sorry,this product is out of instock!!!"
      );
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    router.push("/cart");
  };
  return (
    <Layout>
      <h1>Products</h1>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item md={4} key={product.name}>
            <ProductItem
              product={product}
              onClickHandler={onClickHandler}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const productList = await axios.get(
    "/api/products"
  );
  return {
    props: {
      products: productList.data,
    },
  };
};
