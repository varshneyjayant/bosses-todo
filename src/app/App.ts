import { Server, ErrorMiddleware } from '@overnightjs/core';
import { Logger, LoggerFactory } from '../logger/Logger';
import { Configuration } from '../config/AppConfig';
import { DbHandler } from './DbHandler';
import bodyParser from 'body-parser';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { AuthenticationService } from '../security/AuthenticationService';
import { lazyInject, IocContainer } from '../../inversify.config';
import { TYPES } from './Types';
import { RequestJSONValidatorMiddleware } from '../middlewares/RequestJSONValidator';
import { SecurityController } from '../controllers/SecurityController';
import { UserController } from '../controllers/UserController';
import { TodoController } from '../controllers/TodoController';
import { ErrorHandlerMiddleware } from '../middlewares/ErrorHandlerMiddleware';

export class App extends Server {

    private logger:Logger = LoggerFactory.getLogger(App.name);
    private static instance: App;

    @lazyInject(TYPES.AuthenticaionService)
    private authService: AuthenticationService;

    constructor() {

        super();

        try{

            this.logger.info(`initializing db...`);
            DbHandler.initDb();

            this.logger.info('registering permanent middlewares...');

            this.app.use(cookieParser());
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: true }));

            this.logger.info('configuring sessions...');
            this.app.use(session({
                secret: process.env.SESSON_SECRET,
                resave: false,
                saveUninitialized: false
            }));

            this.logger.info('configuring passport...');

            this.authService.registerPassportAuthWithLocalStrategy();
            this.app.use(passport.initialize());
            this.app.use(passport.session());

            this.registerValidators();

            //registering all route controllers
            this.registerControllers();

            //register error handlers
            this.app.use(ErrorHandlerMiddleware.handleError);

            this.listen();
            
        }   
        catch(err) {

            this.logger.error(err);
        }
    }

    private registerValidators() {

        this.logger.info('registering validators...');

        RequestJSONValidatorMiddleware.initValidator();
    }

    private registerControllers() {

        this.logger.info('registering controllers...');

        const controllers = [];

        const securityController = IocContainer.get<SecurityController>(TYPES.SecurityController);
        controllers.push(securityController);

        const userController = IocContainer.get<UserController>(TYPES.UserController);
        controllers.push(userController);

        const todoController = IocContainer.get<TodoController>(TYPES.TodoController);
        controllers.push(todoController);

        super.addControllers(controllers);
    }

    private listen(){

        this.app.listen(Configuration.appConfig.server.port, () => {

            this.logger.info(`app is now listening on port ${Configuration.appConfig.server.port}...`);
        });
    }

    static initApp() {

        if(!App.instance) App.instance = new App();
    }
}