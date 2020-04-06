import { config } from 'dotenv';
import packageInfo from '../../package.json';

export interface AppConfig {

    appName: string;
    environment: string;
    db: DbConfig;
    server: ServerConfig;
    logging: LoggingConfig;
}

export interface ServerConfig {

    port: number;
}

export interface DbConfig {

    url: string;
    name: string;
}

export interface LoggingConfig {

    defaultLevel: string;
    logsPath: string;
    errorLogsPath: string;
}

export class Configuration {

    static appConfig: AppConfig;

    static initAppConfig() {

        //init dotnetenv
        config();

        this.appConfig = <AppConfig> {

            appName: packageInfo.name,
            environment: process.env.NODE_ENV,
            db: <DbConfig> {
                name: process.env.DB_NAME,
                url: process.env.DB_URL
            },
            logging: <LoggingConfig> {

                defaultLevel: process.env.LOGGING_DEFAULT_LEVEL,
                errorLogsPath: process.env.LOGGING_ERROR_FILE_PATH,
                logsPath: process.env.LOGGING_FILE_PATH
            },
            server: <ServerConfig> {
                port: parseInt(process.env.SERVER_PORT)
            }

        }
        //we do not want this object to be re-assigned
        Object.freeze(this.appConfig);
    }
}