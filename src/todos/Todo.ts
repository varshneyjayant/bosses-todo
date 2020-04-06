import { BaseDto } from '../daos/BaseDao';

export interface Todo extends BaseDto {

    todoId: string;
    title: string;
    description: string;
}