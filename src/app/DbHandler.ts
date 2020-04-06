import { Logger, LoggerFactory} from '../logger/Logger';
import { Configuration } from '../config/AppConfig';
import mongoose from 'mongoose';

export interface DbActionResponse {

    err: any;
    data: any;
}

export class DbHandler {

    private logger: Logger = LoggerFactory.getLogger(DbHandler.name);

    private static instance: DbHandler;

    constructor() {

        this.createDbConnection();
    }

    static initDb() {

        if(!DbHandler.instance) DbHandler.instance = new DbHandler();
    }

    private async createDbConnection() {

        const dbPath = `${Configuration.appConfig.db.url}/${Configuration.appConfig.db.name}`;

        this.logger.debug(`connection string is ${dbPath}`);

        try {

            await mongoose.connect(dbPath, {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true
            });

            mongoose.pluralize(null);

            this.logger.info(`db connection eastablised successfully!`);

        }
        catch(err) {

            this.logger.error(err);
            throw err;
        }
    }

    static getDefaultDbActionResponse () {

        return <DbActionResponse>{
            data: null,
            err: null
        };
    }

    static getDbActionResponse(err, data) {

        const dbActionResponse = DbHandler.getDefaultDbActionResponse();

        if(err != null) {

            dbActionResponse.err = err; 
        }
        else if(data != null){

            dbActionResponse.data = data;
        }

        return dbActionResponse;
    }
}