import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Link,
  Typography,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import NextLink from "next/link";
import React from "react";

const ProductItem = ({
  product,
  onClickHandler,
}) => {
  return (
    <Card>
      <NextLink
        href={`/product/${product.slug}`}
        passHref
      >
        <Link>
          <CardActionArea>
            <CardMedia
              component='img'
              image={product.image}
              title={product.name}
            ></CardMedia>
            <CardContent>
              <Typography>
                {product.name}
              </Typography>
              <Rating
                value={product.rating}
                readOnly
              ></Rating>
            </CardContent>
          </CardActionArea>
        </Link>
      </NextLink>
      <CardActions>
        <Typography>${product.price}</Typography>
        <Button
          size='small'
          color='primary'
          onClick={() => onClickHandler(product)}
        >
          add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductItem;
