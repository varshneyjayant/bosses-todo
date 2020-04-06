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
import { AuthenticationService } from '../../src/security/AuthenticationService';
import { AuthenticationResult, AuthResultTypes } from '../../src/security/Authentication';

chai.use(chaiAsPromised);

describe('Performs operations on AuthenicationService', () => {

    let appConfig = appConfigMock;
    let userId = null;

    let email = 'john.doe@gmail.com';
    let password = 'JohnDoe@123';

    const userService = IocContainer.get<UserService>(TYPES.UserService);
    const authService = IocContainer.get<AuthenticationService>(TYPES.AuthenticaionService);

    before(async () => {

        //mock db connection
        await MongoConnectionMock.mockConnection();

        //create an new user
        const user = <User> {

            firstName: 'John',
            lastName: 'Doe',
            email: email,
            password: password,
            role: 'Todo_Access',
            createdBy: 'Test_ROOT'
        }

        userId = await userService.addUser(user);
    });

    it('authenticateUserWithEmailAndPassword', async () => {

        const authResult: AuthenticationResult = await authService.authenticateUserWithEmailAndPassword(email, password);

        expect(authResult.status).to.eq(AuthResultTypes.SUCCESS);
    });

    it('does not authenticateUserWithEmailAndPassword USER_NOT_FOUND', async() => {

        email = 'someemail@gmail.com';
        const authResult: AuthenticationResult = await authService.authenticateUserWithEmailAndPassword(email, password);

        expect(authResult.status).to.eq(AuthResultTypes.USER_NOT_FOUND);

    });

    it('does not authenticateUserWithEmailAndPassword AUTHENTICATION_FAILED', async() => {

        email = 'john.doe@gmail.com';
        password = 'somePassword@1234';

        const authResult: AuthenticationResult = await authService.authenticateUserWithEmailAndPassword(email, password);

        expect(authResult.status).to.eq(AuthResultTypes.AUTHENTICATION_FAILED);
    });

});