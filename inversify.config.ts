import { Container } from 'inversify'
import getDecorators from 'inversify-inject-decorators';
import { TYPES } from './src/app/Types';
import { UserDao } from './src/daos/UserDao';
import { TodoDao } from './src/daos/TodoDao';
import { UserService } from './src/users/UserService';
import { UserServiceImpl } from './src/users/UserServiceImpl';
import { TodoService } from './src/todos/TodoService';
import { TodoServiceImpl } from './src/todos/TodoServiceImpl';
import { AuthenticationService } from './src/security/AuthenticationService';
import { AuthenticationServiceImpl } from './src/security/AuthenticationServiceImpl';
import { SecurityController } from './src/controllers/SecurityController';
import { UserController } from './src/controllers/UserController';
import { TodoController } from './src/controllers/TodoController';


const IocContainer = new Container();

//bind all types
//dao
IocContainer.bind<UserDao>(TYPES.UserDao).to(UserDao).inSingletonScope();
IocContainer.bind<TodoDao>(TYPES.TodoDao).to(TodoDao).inSingletonScope();

//services
IocContainer.bind<UserService>(TYPES.UserService).to(UserServiceImpl);
IocContainer.bind<TodoService>(TYPES.TodoService).to(TodoServiceImpl);
IocContainer.bind<AuthenticationService>(TYPES.AuthenticaionService).to(AuthenticationServiceImpl);

//controllers
IocContainer.bind<SecurityController>(TYPES.SecurityController).to(SecurityController).inSingletonScope();
IocContainer.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
IocContainer.bind<TodoController>(TYPES.TodoController).to(TodoController).inSingletonScope();

const { lazyInject } = getDecorators(IocContainer, false);

export { IocContainer, lazyInject };

