import { AppConfig, LoggingConfig, ServerConfig } from "../../src/config/AppConfig";
import packageInfo from '../../package.json';

export const appConfigMock = <AppConfig> {

    appName: packageInfo.name,
    environment: 'Test',
    logging: <LoggingConfig> {
        defaultLevel: 'info',
        errorLogsPath: '../../logs/error-test.log',
        logsPath: '../../logs/app-test.log',
    },
    server: <ServerConfig>{
        port: 3002
    }
}