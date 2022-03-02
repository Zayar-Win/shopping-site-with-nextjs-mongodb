import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  navbar: {
    backgroundColor: "#203040",
    "& a": {
      color: "#ffffff",
      marginLeft: 10,
    },
    width: "100%",
  },
  brand: {
    fontWeight: "bold",
    fontSize: "1rem",
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: "80vh",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  session: {
    marginTop: 10,
    marginBottom: 10,
  },
  footer: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  fullWidth: {
    width: "100%",
  },
  mt1: {
    marginTop: "1rem",
  },
  sort: {
    fontWeight: "bold",
    marginRight: ".5rem",
  },
  form: {
    width: "100%",
    maxWidth: 500,
    margin: "0 auto",
  },
  navbarButton: {
    color: "#ffffff",
    textTransform: "initial",
  },
  checkout: {
    background: "transparent",
  },
  reviewForm: {
    maxWidth: 800,
    width: "100%",
  },
  reviewItem: {
    marginRight: "1rem",
    borderRight: "1px #808080 solid",
    paddingRight: "1rem",
  },
  toolbar: {
    justifyContent: "space-between",
    width: "100%",
  },
  menuButton: { padding: 0 },
  searchSection: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  searchForm: {
    border: "1px solid #ffffff",
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  searchInput: {
    paddingLeft: 5,
    color: "#000000",
    "& ::placeholder": {
      color: "#606060",
    },
  },
  iconButton: {
    backgroundColor: "#f8c040",
    padding: 5,
    borderRadius: "0 5px 5px 0",
    "& span": {
      color: "#000000",
    },
  },
}));

export default useStyles;
