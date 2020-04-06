import { Configuration } from "./src/config/AppConfig";
import { Logger } from './src/logger/Logger';
import { App } from './src/app/App';



//init config
Configuration.initAppConfig();

//initi logger
Logger.initLoggers();

//initiate the http server
App.initApp();