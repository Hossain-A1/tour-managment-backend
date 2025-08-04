/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import status from "http-status-codes";
import { envVars } from "../../config/env";
import { ISSLCommerz } from "./sllCommerz.interface";
import AppError from "../../errorHelpers/AppError";
import { PaymentModel } from "../payment/payment.model";

const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: envVars.SSL.STORE_ID,
      store_passwd: envVars.SSL.STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
      fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
      cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
      ipn_url: envVars.SSL.SSL_IPN_URL,
      shipping_method: "N/A",
      product_name: "Appointment",
      product_catepory: "service",
      product_profile: "general",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1020",
      cus_country: "Bangladesh",
      cus_phone: payload.phoneNumber,
      cus_fax: "N/A",
      ship_name: "N/A",
      ship_add1: "Brahmonbaria",
      ship_add2: "Nibanagor",
      ship_city: "Brahmonbaria",
      ship_state: "Brahmonbaria",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    const response = await axios({
      method: "POST",
      url: envVars.SSL.SSL_PAYMENT_API,
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error: any) {
    console.log("payment error occurd", error);
    throw new AppError(status.BAD_REQUEST, error?.message);
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${envVars.SSL.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVars.SSL.STORE_ID}&store_passwd=${envVars.SSL.STORE_PASS}`,
    });

    console.log("sslcommerz validate api response", response.data);

    await PaymentModel.updateOne(
      { transactionId: payload.tran_id },
      {
        paymentGatewayData: response.data,
      },
      { runValidators: true }
    );
  } catch (error: any) {
    throw new AppError(401, `Validate payment error: ${error.message}`);
  }
};

export const SSLService = {
  sslPaymentInit,
  validatePayment,
};
