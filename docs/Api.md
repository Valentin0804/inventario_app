# Documentación de la API REST

Base URL: http://localhost:3000/api

##  Autenticación

### POST `/auth/login`
### POST `/auth/registro`


## 📦 Productos

### GET `/productos`
### POST `/productos`
### PUT `/productos/:id`
### DELETE `/productos/:id`

Request protegido con: Authorization: Bearer <token>

## MercadoPago

### POST `/mercadopago/create-payment`
### POST `/webhook`
(public route)
