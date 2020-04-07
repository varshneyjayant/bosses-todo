# bosses-todo
Keeps the todo list of pointy haired boss

### Major Dependencies

- Typescript
- Express
- @Overnight/Core
- @Overnight/Jwt
- Passport
- Mongoose
- Inversify
- Winston
- Jsonwebtoken


### Commands to run

- Build Code: `npm run build`
- Run Unit test cases: `npm run test`
- Run app in development mode: `npm run play`
- Run app in production mode: `npm run prod`

## Service Details

In `development` mode, this app runs on 3001 port. Following REST APIs are exposed.

## Add User
```
POST http://localhost:3001/user
```
Body
```
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@someemail.com",
  "password": "SomePassword@123"
}
```
**NOTE:** This API is currently exposed without authentication to add a few users without login.




## Login User
```
POST http://localhost:3001/security/login
```
Body
```
{
  "email": "youremail@email.com",
  "password": "yourPassword@123"
}
```
On successful authentication, you will recieve the following response header with the JWT token to access TODO APIs.

```
auth-token: <some-encrypted-jwt-token>
```

## Todo APIs

To access Todo APIs, a requester must be authenticated and have the JWT access token.

**Request Header**
```
Authorization: Bearer <some-encrypted-jwt-token>
```

### Add Todo
```
POST http://localhost:3001/secure/todo
```
Body
```
{
 "title": "Take interview",
 "description": "Node.js items are lined up!"
}
```

### GET TODO
```
GET http://localhost:3001/secure/todo
```

### UPDATE TODO
```
PUT http://localhost:3001/secure/todo
```
Body
```
{
 "title": "Take interview Today",
 "todoId": "7abeb4e4-b112-47b5-b2d7-3e8189fa026e"
}
```

### DELETE TODO
```
DELETE http://localhost:3001/secure/todo/<todoId>
```
