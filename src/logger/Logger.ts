import winston from 'winston';
import { Configuration } from '../config/AppConfig';
import os from 'os';

enum LogLevels {

    //WE MUST NOT ENABLE DEBUG LOGS IN PROD UNLESS REQUIRED
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}

interface Log {

    app: string;
    hostName: string;
    event: any,
    timestamp: string;
    class:string,
    method: string,
    err?: LogError
}

interface LogError {

    msg: any;
    stack: any;
    name?: string;
}

class WinstonLogger {

    static logger: any;

    static initWinstonLogger() {

        WinstonLogger.logger = winston.createLogger({
            level: Configuration.appConfig.logging.defaultLevel,
            format: winston.format.json(),
            transports: [

                new winston.transports.File({ filename: Configuration.appConfig.logging.logsPath }),
                new winston.transports.File({ level: LogLevels.ERROR, filename: Configuration.appConfig.logging.errorLogsPath })
            ]
        });

        if(Configuration.appConfig.environment != "production" && Configuration.appConfig.environment != "test") {

            WinstonLogger.logger.add(new winston.transports.Console({
                format: winston.format.prettyPrint()
            }));
        }
    }
}

export class LoggerFactory {

    private static loggerMap: Map<string, Logger> = new Map<string, Logger>(); 

    static getLogger(clazz: string) {
        
        if(!LoggerFactory.loggerMap.has(clazz)) {

            LoggerFactory.loggerMap.set(clazz, new Logger(clazz));
        }

        return LoggerFactory.loggerMap.get(clazz);
    }
}

export class Logger {

    private winstonLogger: any;

    static initLoggers() {

        if(!WinstonLogger.logger) {

            WinstonLogger.initWinstonLogger();
        }
    }
    
    constructor(public clazz: string) {}

    
    private getHandler() {

        const stack = new Error().stack || "";

        if(stack != "") {

            return stack.split("at ")[4].trim().split(' ')[0];
        }
        else{
            return "";
        }
    }

    private formatMessage(msg: any): Log {

        const log = <Log>{

            app: Configuration.appConfig.appName,
            timestamp: new Date().toISOString(),
            hostName: os.hostname(),
            class: this.clazz,
            method: this.getHandler(),
            event: msg
        }

        return log;
    }

    private formatErrorMessage(err: Error | string): Log {

        const log = <Log>{

            app: Configuration.appConfig.appName,
            timestamp: new Date().toISOString(),
            hostName: os.hostname(),
            class: this.clazz,
            method: this.getHandler(),
            err: <LogError>{}
        }

        if(err instanceof Error) {

            log.err.name = err.name;
            log.err.msg = err.message;
            log.err.stack = err.stack || "";

        }
        else {

            log.err.name = "Unknown Error";
            log.err.msg = err;
            log.err.stack = new Error().stack || "";
        }

        return log;
    }

    private logEvent(level: LogLevels, event: any) {

        if(!this.winstonLogger){
            this.winstonLogger = WinstonLogger.logger;
        }

        this.winstonLogger.log(level, event);
    }

    info(msg: any) {

        this.logEvent(
            LogLevels.INFO,
            this.formatMessage(msg)
        );
    }

    debug(msg: any) {

        this.logEvent(
            LogLevels.DEBUG,
            this.formatMessage(msg)
        );
    }

    warning(msg: any) {

        this.logEvent(
            LogLevels.WARN,
            this.formatMessage(msg)
        );
    }

    error(err: Error | string) {

        this.logEvent(
            LogLevels.ERROR,
            this.formatErrorMessage(err)
        );
    }
}