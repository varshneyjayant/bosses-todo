import { describe, it, before } from 'mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { MongoConnectionMock } from '../__mocks__/DbConnectionMock';
import { appConfigMock } from '../__mocks__/AppConfigMock';
import { IocContainer } from '../../inversify.config';
import { UserService } from '../../src/users/UserService';
import { TYPES } from '../../src/app/Types';
import { User } from '../../src/users/User';
import { ServiceError } from '../../src/middlewares/ErrorHandlerMiddleware';

chai.use(chaiAsPromised);

describe('Performs operations on UserService', () => {

    let appConfig = appConfigMock;
    let userId = null;
    
    const email = 'john.doe@gmail.com';
    const userService = IocContainer.get<UserService>(TYPES.UserService);

    before(async () => {

        //get db mock setup
        await MongoConnectionMock.mockConnection();
        
    });

    it('addUser', async () => {

        const user = <User> {

            firstName: 'John',
            lastName: 'Doe',
            email: email,
            password: 'JohnDoe@123',
            role: 'Todo_Access',
            createdBy: 'Test_ROOT'
        }

        userId = await userService.addUser(user);

        expect(userId).not.null;
    });

    it('getUserForAuthentication', async () => {

        const userDetails = await userService.getUserForAuthentication(email);
        expect(userDetails.userId).to.eq(userId);
    });

    it('does not addUser', () => {

        const user = <User>{

            firstName: 'John',
            lastName: 'Doe',
            password: 'JohnDoe@123'
        };

        expect(userService.addUser(user)).to.eventually.throw(ServiceError);
        
    });
    
});