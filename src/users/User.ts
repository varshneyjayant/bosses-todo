import { BaseDto } from '../daos/BaseDao';
import { Todo } from '../todos/Todo';

export interface User extends BaseDto {

    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string;
    role: string;
}