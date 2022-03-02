import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  Menu,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";
import db from "../utils/db";
import Product from "../models/Product";
import Layout from "../components/Layout";
import useStyles from "../utils/styles";
import {
  Pagination,
  Rating,
} from "@material-ui/lab";
import Cancel from "@material-ui/icons/Cancel";
import ProductItem from "../components/ProductItem";

const PAGE_SIZE = 3;

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];

const ratings = [1, 2, 3, 4, 5];

const SearchPage = ({
  categories,
  brands,
  products,
  countProducts,
  pages,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const {
    query = "all",
    category = "all",
    brand = "all",
    price = "all",
    rating = "all",
    sort = "featured",
  } = router.query;

  const filterSearch = ({
    category,
    brand,
    price,
    rating,
    sort,
    page,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (sort) query.sort = sort;
    if (page) query.page = page;

    router.push({
      pathname: path,
      query: query,
    });
  };

  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };

  const brandHandler = (e) => {
    filterSearch({ brand: e.target.value });
  };

  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };

  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };

  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const pageHandler = (e, page) => {
    filterSearch({ page });
  };

  return (
    <Layout title='Search Page'>
      <Grid
        container
        spacing={1}
        className={classes.mt1}
      >
        <Grid item md={3}>
          <List>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography variant='h6'>
                  Categories
                </Typography>
                <Select
                  fullWidth
                  value={category}
                  onChange={(e) =>
                    categoryHandler(e)
                  }
                >
                  <MenuItem value='all'>
                    All
                  </MenuItem>
                  {categories?.map((category) => (
                    <MenuItem
                      key={category}
                      value={category}
                    >
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography variant='h6'>
                  Brands
                </Typography>
                <Select
                  fullWidth
                  value={brand}
                  onChange={(e) =>
                    brandHandler(e)
                  }
                >
                  <MenuItem value='all'>
                    All
                  </MenuItem>
                  {brands?.map((brand) => (
                    <MenuItem
                      key={brand}
                      value={brand}
                    >
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography variant='h6'>
                  Prices
                </Typography>
                <Select
                  fullWidth
                  value={price}
                  onChange={(e) =>
                    priceHandler(e)
                  }
                >
                  <MenuItem value='all'>
                    All
                  </MenuItem>
                  {prices?.map((price) => (
                    <MenuItem
                      key={price.value}
                      value={price.value}
                    >
                      {price.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography variant='h6'>
                  Rating
                </Typography>
                <Select
                  fullWidth
                  value={rating}
                  onChange={(e) =>
                    ratingHandler(e)
                  }
                >
                  <MenuItem value='all'>
                    All
                  </MenuItem>
                  {ratings.map((rate) => (
                    <MenuItem
                      key={rate}
                      value={rate}
                    >
                      <Rating
                        value={rate}
                        readOnly
                      ></Rating>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid itme md={9}>
          <Grid
            container
            alignItems='center'
            justifyContent='space-between'
          >
            <Grid item>
              {products.length === 0
                ? "No"
                : countProducts}{" "}
              Results
              {query !== "all" &&
                query !== "" &&
                "  :" + query}
              {category !== "all" &&
                " : " + category}
              {brand !== "all" && " : " + brand}
              {price !== "all" && " : " + price}
              {rating !== "all" &&
                " : " + rating + " Stars"}
              {(query !== "" &&
                query !== "all") ||
              category !== "all" ||
              brand !== "all" ||
              price !== "all" ||
              rating !== "all" ? (
                <Button
                  onClick={() =>
                    router.push("/search")
                  }
                >
                  <Cancel />
                </Button>
              ) : null}
            </Grid>
            <Grid item>
              <Typography
                component='span'
                className={classes.sort}
              >
                Sort by
              </Typography>
              <Select
                value={sort}
                onChange={(e) => sortHandler(e)}
              >
                <MenuItem value='featured'>
                  Featured
                </MenuItem>
                <MenuItem value='lowest'>
                  Price : Low to High
                </MenuItem>
                <MenuItem value='highest'>
                  Price : High to Low
                </MenuItem>
                <MenuItem value='toprated'>
                  Customer Reviews
                </MenuItem>
                <MenuItem value='newest'>
                  Newest Arrivals
                </MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            className={classes.mt1}
          >
            {products.map((product) => (
              <Grid item md={4} key={product._id}>
                <ProductItem product={product} />
              </Grid>
            ))}
          </Grid>
          <Pagination
            className={classes.mt1}
            count={pages}
            onChange={pageHandler}
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default SearchPage;

export const getServerSideProps = async ({
  query,
}) => {
  console.log(PAGE_SIZE);
  const searchQuery = query.query || "";
  const category = query.category || "";
  const brand = query.brand || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const sort = query.sort || "";
  const page = query.page || 1;
  await db.connect();
  const categories =
    await Product.find().distinct("category");

  const brands = await Product.find().distinct(
    "brand"
  );

  const queryFilter =
    searchQuery && searchQuery !== ""
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};

  const categoryFilter =
    category && category !== "all"
      ? { category }
      : {};
  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};
  const brandFilter =
    brand && brand !== "all" ? { brand } : {};
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};

  const sortFilter =
    sort === "featured"
      ? { featured: -1 }
      : sort === "lowest"
      ? { price: 1 }
      : sort === "highest"
      ? { price: -1 }
      : sort === "toprated"
      ? { rating: -1 }
      : sort === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };

  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...brandFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    "-reviews"
  )
    .sort(sortFilter)
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE)
    .lean();

  const countProducts =
    await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...brandFilter,
      ...priceFilter,
      ...ratingFilter,
    });

  await db.disconnect();

  const products = productDocs.map(
    db.convertDocToObj
  );

  return {
    props: {
      categories,
      brands,
      products,
      countProducts,
      pages: Math.ceil(countProducts / PAGE_SIZE),
    },
  };
};
