The project has two applications. The apigateway application accepts http requests from the client and communicates with the auth application via grpc. The auth application performs database operations and returns a response to the apigateway application. Apigateway sends a response to the client.

start protject

clone github repository

npm install

create an .env file and write variables in it to connect to the mongo database. An example of variable names can be found in the env.sample file

run npm proto:gen, copy file auth.ts from ./proto/auth.ts to the folder ./lib/common/src/types

npm start apigateway

npm start auth

GET http://localhost:3000/users - return all users
GET http://localhost:3000/users/:id - return user by id

POST http://localhost:3000/users - create new user. 
body
{
	"username": string,
  "password": string,
  "subscribed": boolean
}

PATCH http://localhost:3000/users/"id - update user subscribed
body
{
	"id": string,
  "subscribed": boolean
}

DELETE http://localhost:3000/users/"id - delete user


