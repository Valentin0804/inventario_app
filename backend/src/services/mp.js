import mercadopago from "mercadopago";
import dotenv from "dotenv";
dotenv.config();

mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN
});

export default mercadopago;
