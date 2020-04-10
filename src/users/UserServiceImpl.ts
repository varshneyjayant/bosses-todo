import { UserService } from './UserService';
import { User } from './User';
import { v4 as uuidv4 } from 'uuid';
import { UserDto, UserDao } from '../daos/UserDao';
import { EncryptionUtils } from '../utils/EncryptionUtils';
import { ServiceError } from '../middlewares/ErrorHandlerMiddleware';
import { injectable, inject } from 'inversify';
import { TYPES } from '../app/Types';


@injectable()
export class UserServiceImpl implements UserService {

    @inject(TYPES.UserDao)
    private userDao: UserDao;

    async addUser(user: User): Promise<string> {

        const userDto: UserDto = <UserDto>user;

        userDto.userId = uuidv4();
        userDto.password = await EncryptionUtils.getEncryptedValue(user.password);
        
        //adding hardcoded role for now
        userDto.role = "Todo_Access";

        const dbResponse = await this.userDao.addUser(userDto);

        if(dbResponse.err != null) throw new ServiceError(dbResponse.err);
        else return (<User>dbResponse.data).userId;
    }

    async getUserForAuthentication(email: string): Promise<User> {

        const dbResponse = await this.userDao.getUserByEmail(email);

        if(dbResponse.err) throw new ServiceError(dbResponse.err);
        else if(dbResponse.data == null) return null;
        else return <User>dbResponse.data;
    }
}