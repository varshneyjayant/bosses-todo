import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection } from 'mongoose';

export class MongoConnectionMock {

    private static memoryServer: MongoMemoryServer;
    private static connection: Connection;

    static async mockConnection() {

        MongoConnectionMock.memoryServer = new MongoMemoryServer();
        const mongoUri = await MongoConnectionMock.memoryServer.getUri();

        //now create mock connection
        await mongoose.connect(mongoUri, {

            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        MongoConnectionMock.connection = mongoose.connection;
    }

    static async closeMockConnection() {

        try{
            await MongoConnectionMock.connection.close(true);
        }
        catch(err){ //ingnored 
        }
    }
}