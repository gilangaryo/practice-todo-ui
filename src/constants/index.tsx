import TodoListAbi from '../contracts/TodoList.json';

export const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
export const TODOLIST_ABI = TodoListAbi;
// export const TODOLIST_ADDRESS = '0x77d951744e57Cc507770E5a232FecDC3358A2a5A';
export * from './contracts';
