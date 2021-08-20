
# Express Api CoinGecko

This project is written in Typescript and use some library that work with decorators.

The main libraries used are:
- express.js to build endpoint api.
- mongodb-memory-server as database.
- class-validation for the request body validation, this is easier to read that joi.
- winston is an tool for make log of app.

This project does not use inversify or inversify-express-utils for use common code of express in Typescript, for supply singleton object and dependency injection this project use export const in the modules.

## Database
To not install and configure a database server, the application is configured with mongodb-memory-server, this is a implementation of MongoDB in memory for testing.

## How to run the app
The app use .env file for configure environment variables, the project have the sample file .env.sample.
To copy the file to run locally you can use the next command:
```
npm run copy-dot-env
```
With the .env file configured you can use the next command:
### Install dependency:
```
npm i
```
### Build and run the project:
```bash
npm run build; npm start
```
### Other Command:
- Run and auto compile for develop:
```
npm run watch
```
- Or run, auto compile and debug:
```
npm run watch-debug
```
- Run unit test and coverage
```
npm run test
```

## How to use

### Swagger
Swagger run in http://localhost:3000/api-docs

All api body must have JSON notation, the payload request varies for each endpoint, but the response always has the same structure.
- response structure:
status: true if the operation was executed correctly
error: is optional, if status is false the response has a error with message string error in spanish.
data: is optional, return string, object or array according to each endpoint.
```json
{
	"status": "boolean",
	"error": "string",
	"data": "any"
}
```

### Create account
method:
`POST`
endpoint:
`/create-account`
request:
```json
{
	"name": "string",
	"lastName": "string",
	"user": "string",
	"currency": "string",
	"password": "string"
}
```
The password must have at least one number and one letter, the minimum size must be 8 characters.
response:
```json
{
	"status": "boolean"
}
```

### Login
method:
`POST`
endpoint:
`/login`
request:
```json
{
	"user":"string",
    "password": "string"
}
```
response:
```json
{
    "status": "boolean",
    "data": "string"
}
```
The value of data in response is a jwt to make the authentication request, the header "Authorization" must have the value whit the string "Bearer", ej: `Authorization: Bearer token`
The token expires in the time in seconds specified in the file .env in the value of SESSION_TIMEOUT

### Get all coins
method:
`GET`
endpoint:
`/operations/coins`

response:
```json
{
    "status": "boolean",
    "data": "Array<{ symbol:string, price: number, name: string, image: string, lastUpdated: string}>"
}
```
Requires Authorization header

### Add coin to user
endpoint:
`/operations/add-coin`
request:
```json
{
	"coin": "string"
}
```
response:
```json
{
    "status": "boolean",
    "data": "string"
}
```
Requires Authorization header

### Get top of coins
method:
`GET`
endpoint:
`/operations/top-coins/:numberOfCoin/:sort`
:numberOfCoin is the symbol of coin to add
:sort is optional, "asc" for sort coins in ascending and "des" descending
ej: /operations/addCoin/eth/des
response:
```json
{
    "status": "boolean",
    "data": "Array<{ symbol:string, priceArs: number, priceUsd: number, priceEur: number, name: string, image: string, lastUpdated: string}>"
}
```
Requires Authorization header

### Postman examples
The file apiCoinGecko.postman_collection.json contain a collection with examples of endpoint, it is necessary to set variable "authorization" with the token that return login, this value is send in Authorization header.

## Structure of documents
For a develop easier the relationship into documents use the key "user", in the real application the best option in mongodb is to use the key "_id".

## TODO
- Create index in mongodb: as the database is in memory, no indices were created, **The best way to control unique data is the index**.
