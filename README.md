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
`npm run copy-dot-env`
With the .env file configured you can use the next command:
### Install dependency:
```npm i```
### Build and run the project:
```npm run build```
```npm start```
### Other Command:
- Run and auto compile for develop:
```npm run watch```
- Run unit test and coverage
```npm run test```
## How to use
All api body must have JSON notation, the payload request varies for each endpoint, but the response always has the same structure.
- response structure:
status: true if the operation was executed correctly
error: is optional, if status is false the response has a error with message string error.
data: is optional, return string, object or array according to each endpoint.
```json
{
	"status": "boolean",
	"error": "string",
	"data": "any"
}
```
### Create account
endpoint:
`/create`
body format:
```json
{
	"name": "string",
	"lastName": "string",
	"user": "string",
	"coin": "string",
    "password": "string"
}
```
The password must have at least one number and one letter, the minimum size must be 8 characters.