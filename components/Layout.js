import Head from "next/head";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Badge,
  Switch,
  Button,
  Menu,
  MenuItem,
  Divider,
  ListItem,
  ListItemText,
  List,
  Box,
  IconButton,
  Drawer,
  InputBase,
} from "@material-ui/core";
import NextLink from "next/link";
import useStyles from "../utils/styles";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import MenuIcon from "@material-ui/icons/Menu";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";

const Layout = ({ title, children }) => {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const [dark, setDark] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const [categories, setCategories] = useState(
    []
  );

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWeight: 500,
        margin: "1rem 0",
        fontFamily: "Roboto,sans-serif",
      },
    },
    palette: {
      type: dark ? "dark" : "light",
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });
  const darkModeHandler = () => {
    dispatch({
      type: dark
        ? "DARK_MODE_OFF"
        : "DARK_MODE_ON",
    });
    const newDarkMode = !dark;
    Cookies.set(
      "darkMode",
      newDarkMode ? "ON" : "OFF"
    );
  };

  const categoryFetch = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/products/categories"
      );
      setCategories(data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    setDark(darkMode);
    categoryFetch();
  }, [darkMode]);
  const [sidbarVisible, setSidebarVisible] =
    useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e, redirect) => {
    setAnchorEl(null);
    router.push(redirect);
  };

  const [query, setQuery] = useState("");

  const queryHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const logoutHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    router.push("/");
  };

  return (
    <div>
      <Head>
        <title>
          {title
            ? `ZayEcommerce - ${title}`
            : "ZayEcommerce"}
        </title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar
          position='static'
          className={classes.navbar}
        >
          <Toolbar className={classes.toolbar}>
            <Box
              display='flex'
              alignItems='center'
            >
              <IconButton
                edge='start'
                aria-label='open drawer'
                onClick={sidebarOpenHandler}
                className={classes.menuButton}
              >
                <MenuIcon
                  className={classes.navbarButton}
                ></MenuIcon>
              </IconButton>
              <NextLink href='/' passHref>
                <Link>
                  <Typography
                    className={classes.brand}
                  >
                    ZayEcommerce
                  </Typography>
                </Link>
              </NextLink>
            </Box>
            <Drawer
              anchor='left'
              open={sidbarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <Typography>
                      Shopping by category
                    </Typography>
                    <IconButton
                      aria-label='close'
                      onClick={
                        sidebarCloseHandler
                      }
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <NextLink
                    href={`/search?category=${category}`}
                    passHref
                    key={category}
                  >
                    <ListItem
                      component='a'
                      button
                      onClick={
                        sidebarCloseHandler
                      }
                    >
                      <ListItemText
                        primary={category}
                      ></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>
            <div
              className={classes.searchSection}
            >
              <form
                className={classes.searchForm}
                onSubmit={queryHandler}
              >
                <InputBase
                  name='query'
                  className={classes.searchInput}
                  placeholder='Search products'
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                />
                <IconButton
                  type='submit'
                  className={classes.iconButton}
                  aria-label='search'
                >
                  <SearchIcon />
                </IconButton>
              </form>
            </div>
            <div>
              <Switch
                checked={dark}
                onChange={darkModeHandler}
              ></Switch>
              <NextLink href='/cart' passHref>
                <Link>
                  <Typography component='span'>
                    {cart?.cartItems?.length >
                    0 ? (
                      <Badge
                        color='secondary'
                        badgeContent={
                          cart?.cartItems?.length
                        }
                      >
                        Cart
                      </Badge>
                    ) : (
                      "Cart"
                    )}
                  </Typography>
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls='simple-menu'
                    aria-haspopup='true'
                    className={
                      classes.navbarButton
                    }
                    onClick={(e) =>
                      loginClickHandler(e)
                    }
                  >
                    {userInfo?.name}
                  </Button>
                  <Menu
                    id='simple-menu'
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={(e) =>
                        handleClose(e, "/profile")
                      }
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        handleClose(
                          e,
                          "/order-history"
                        )
                      }
                    >
                      Order History
                    </MenuItem>
                    <MenuItem
                      onClick={logoutHandler}
                    >
                      Logout
                    </MenuItem>
                    {userInfo.is_Admin && (
                      <MenuItem
                        onClick={(e) =>
                          handleClose(
                            e,
                            "/admin/dashboard"
                          )
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                  </Menu>
                </>
              ) : (
                <NextLink href='/login' passHref>
                  <Link>
                    <Typography component='span'>
                      Login
                    </Typography>
                  </Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>
          {children}
        </Container>
        <footer className={classes.footer}>
          All righ served. ZayEcommerce
        </footer>
      </ThemeProvider>
    </div>
  );
};

export default Layout;
