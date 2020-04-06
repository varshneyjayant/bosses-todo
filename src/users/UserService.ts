import { User } from './User';


export interface UserService {

    addUser(user: User): Promise<string>;

    getUserForAuthentication(email: string): Promise<User>;

}