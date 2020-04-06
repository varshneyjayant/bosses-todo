import 'reflect-metadata';

//dependency injection
export const TYPES = {

    //daos
    UserDao: Symbol.for('UserDao'),
    TodoDao: Symbol.for('TodoDao'),


    //services
    UserService: Symbol.for('UserService'),
    TodoService: Symbol.for('TodoService'),
    AuthenticaionService: Symbol.for('AuthenticationService'),

    //Controllers
    SecurityController: Symbol.for('SecurityController'),
    UserController: Symbol.for('UserController'),
    TodoController: Symbol.for('TodoController')
}