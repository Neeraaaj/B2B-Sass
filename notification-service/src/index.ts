import 'dotenv/config';
import { bootstrap } from './app/bootstrap';

bootstrap();


interface Empty{

}

interface Task {
    id: number,
    title: string,
    completed: boolean
}

interface TaskList {
    tasks: Task[]
}


class TaskService{
    GetTasks (prop: Empty): TaskList {
        return {tasks: [{id: 1, title: "", completed: false}]}
    }
}