import { Todo } from './Todo';

export interface TodoService {

    addTodo(todo: Todo): Promise<Todo[]>;

    getTodos(ownerId: string): Promise<Todo[]>;

    updateTodo(todo: Todo): Promise<Todo[]>;

    removeTodo(todoId: string, ownerId: string): Promise<Todo[]>;
}