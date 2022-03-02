import {
  Step,
  StepLabel,
  Stepper,
} from "@material-ui/core";
import React from "react";
import useStyles from "../utils/styles";

const CheckoutWizard = ({ step }) => {
  const classes = useStyles();
  return (
    <Stepper
      activeStep={step}
      alternativeLabel
      className={classes.checkout}
    >
      {[
        "Login",
        "Shipping Address",
        "Payment Method",
        "Place Order",
      ].map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutWizard;
