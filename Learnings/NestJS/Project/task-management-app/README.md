# Here we have 2 modules:

- 1. TasksModule: TaskController, TaskService, TaskEntoty, TaskRepository, Status ValidationPipe, ---
- 2. AuthModule: AuthController, Authservice, UserEntity, UserRepository. JwtStrategy, ----

# Api Endpoints: auth/signup/ and auth/signin/

- Get
  tasks/
  tasks/:id

- Post:
  tasks/

- Delete
  tasks/id:

- Path:update
  task/:id/status/

# delete app module files except module and main.ts file:

# We will create a task module: where we keep all things related to our task module

- nest g mo tasks

# create task controller to handle request:

- nest g co tasks --no-spec

# create task service: contain business logic like creation,deletion, updation etc:

- nest g s tasks --no-spec


# We will define empty task in service and set a route to tasks which will return us []:
# tasks.module.ts:

import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
controllers: [TasksController],
providers: [TasksService]
})
export class TasksModule {}

# tasks.service.ts:

import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {

    private tasks = [];

    getAllTasks(){
        return  this.tasks;
    }

}

# tasks.controller.ts:

import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
constructor(private readonly tasksService: TasksService) {}

@Get()
getAllTasks() {
return this.tasksService.getAllTasks();
}
}


# test on: http://localhost:3000/tasks: we get : []

# now we create a model file which is a interface structure of our task: our file name will be task.model.ts

export interface Task {
id: string;
title: string;
description: string;
status: TaskStatus;
}

enum TaskStatus {
OPEN = 'OPEN',
In_PROGRESS = 'IN_PROGRESS',
DONE = 'DONE',
}

# import this tasks in our tasks.service.ts:

import { Injectable } from '@nestjs/common';
import { Task } from './task.model';

@Injectable()
export class TasksService {
private tasks: Task[] = [];

getAllTasks(): Task[] {
return this.tasks;
}
}

# tasks.controller.ts:

import { Controller, Get } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
constructor(private readonly tasksService: TasksService) {}

@Get()
getAllTasks(): Task[] {
return this.tasksService.getAllTasks();
}
}

# Now, we are moving towards the creation of the task:

import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
private tasks: Task[] = [];

// This method returns all tasks in the tasks array
getAllTasks(): Task[] {
return this.tasks;
}

// This method creates a new task and adds it to the tasks array: Return type will be single task not an array: id, status will be auto generated, but titile and description will be provided by the user
createTask(title: string, description: string): Task{
const task: Task = {
id: '',
title,
description,
status: TaskStatus.OPEN,
}
}

# to generate auto id we use uuid: npm add uuid

import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid'; // Importing uuidv4 to generate unique IDs for tasks

@Injectable()
export class TasksService {
private tasks: Task[] = [];

// This method returns all tasks in the tasks array
getAllTasks(): Task[] {
return this.tasks;
}

createTask(title: string, description: string): Task {
const task: Task = {
id: uuid(), // Generate a unique ID for the task
title,
description,
status: TaskStatus.OPEN,
};
}
}

# now we need to push this task to our task array:

import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid'; // Importing uuidv4 to generate unique IDs for tasks

@Injectable()
export class TasksService {
private tasks: Task[] = [];

// This method returns all tasks in the tasks array
getAllTasks(): Task[] {
return this.tasks;
}

createTask(title: string, description: string): Task {
const task: Task = {
id: uuid(), // Generate a unique ID for the task
title,
description,
status: TaskStatus.OPEN,
};

    this.tasks.push(task); // Add the new task to the tasks array
    return task; // Return the created task

}
}

# We have defined our business logic of create task is defined in service. Now lets handle the post request in task.controler.ts:

import { Controller, Get, Post, Body } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
constructor(private readonly tasksService: TasksService) {}

@Get()
getAllTasks(): Task[] {
return this.tasksService.getAllTasks();
}

//1.2 Extracting specific property from body:
@Post()
createTask(
@Body('title') title: string,
@Body('description') description: string,
) {
console.log('Title:', title);
console.log('Description:', description);
}

// //1.1 This way we extract all the properties from the body. This is not a good practice
// @Post()
// createTask(@Body() body) {
// console.log(body);
// }
}

# now lets return task: tasks.controller.ts:

import { Controller, Get, Post, Body } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
constructor(private readonly tasksService: TasksService) {}

@Get()
getAllTasks(): Task[] {
return this.tasksService.getAllTasks();
}

@Post()
createTask(
@Body('title') title: string,
@Body('description') description: string,
): Task {
return this.tasksService.createTask(title, description);
}
}

# We now learn the concept of DTO (data transfer object): It is a place where we manage the shape of the data as it flows through the different components of our application: In short same data ko hm ko access krne k liye http request send kr rhe hai request body k liye jo hmre controller mai hai fir hm usse create kr rhe hai taskservice mai fir uss response ko send kr rhe hai. To hmra title and description baar baar request ho rha hai and if hme ko bhi changes krne hoge to hme saaari file mai krna pdega jisko avoid krne k liye DTO ka concept aya hai.

- DTO can be defined using classes and interface we use classes as part of javascript so they can be preserved post-compilation, allow us to do more. Interface are a part of Typescript and therefore are not preserved post-compilation and they cannot be refer at run time.

# creating dto for create task: create-task.dto.ts:

export class createTaskDto{
title: string;
description: string;
}

# to use this dto: We go to our: task.controller.ts:

import { Controller, Get, Post, Body } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { create } from 'domain';

@Controller('tasks')
export class TasksController {
constructor(private readonly tasksService: TasksService) {}

@Get()
getAllTasks(): Task[] {
return this.tasksService.getAllTasks();
}

@Post()
createTask(@Body() createTaskDto: CreateTaskDto): Task {
return this.tasksService.createTask(createTaskDto);
}
}

# now currently our createTask in task.service expecting title and description so we replace it with createTaskDto:

import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
private tasks: Task[] = [];

getAllTasks(): Task[] {
return this.tasks;
}

createTask(createTaskDto: CreateTaskDto): Task {
// Destructure(es6 concept) the DTO to get title and description
const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;

}
}

---------------------------------------------------------

# now we implement thing like fetching single task with id:

import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
private tasks: Task[] = [];

getAllTasks(): Task[] {
return this.tasks;
}

// This method is used to get a task by its ID
getTaskById(id: string): Task {
const task = this.tasks.find((task) => task.id === id);
if (!task) {
throw new Error(`Task with ID ${id} not found`);
}
return task;
}

createTask(createTaskDto: CreateTaskDto): Task {
const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;

}
}

# task.controller.ts:

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { create } from 'domain';

@Controller('tasks')
export class TasksController {
constructor(private readonly tasksService: TasksService) {}

@Get()
getAllTasks(): Task[] {
return this.tasksService.getAllTasks();
}

// This method is used to get a task by its ID
@Get('/:id')
getTaskById(@Param('id') id: string): Task {
return this.tasksService.getTaskById(id);
}

@Post()
createTask(@Body() createTaskDto: CreateTaskDto): Task {
return this.tasksService.createTask(createTaskDto);
}
}

# now lets create a for delete task: task.service.ts:

import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
private tasks: Task[] = [];

getAllTasks(): Task[] {
return this.tasks;
}

getTaskById(id: string): Task {
const task = this.tasks.find((task) => task.id === id);
if (!task) {
throw new Error(`Task with ID ${id} not found`);
}
return task;
}

createTask(createTaskDto: CreateTaskDto): Task {
const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;

}

// delete task:
deleteTask(id: string): void{
this.tasks = this.tasks.filter((task)=> task.id !== id); // only keeping those task where the ID of a task is not identical
}
}

# task.controller.ts:

import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { create } from 'domain';

@Controller('tasks')
export class TasksController {
constructor(private readonly tasksService: TasksService) {}

@Get()
getAllTasks(): Task[] {
return this.tasksService.getAllTasks();
}

// This method is used to get a task by its ID
@Get('/:id')
getTaskById(@Param('id') id: string): Task {
return this.tasksService.getTaskById(id);
}

@Post()
createTask(@Body() createTaskDto: CreateTaskDto): Task {
return this.tasksService.createTask(createTaskDto);
}

@Delete('/:id')
deleteTask(@Param('id') id: string): void {
return this.tasksService.deleteTask(id);
}
}

# updating task: here we r updating status of task

import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
private tasks: Task[] = [];

getAllTasks(): Task[] {
return this.tasks;
}

getTaskById(id: string): Task {
const task = this.tasks.find((task) => task.id === id);
if (!task) {
throw new Error(`Task with ID ${id} not found`);
}
return task;
}

createTask(createTaskDto: CreateTaskDto): Task {
const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;

}

deleteTask(id: string): void{
this.tasks = this.tasks.filter((task)=> task.id !== id);
}

// update task:
updateTask(id:string, status: TaskStatus){
const task = this.getTaskById(id);
task.status = status;
return task;
}
}

# task.controller.ts:

import {
Controller,
Get,
Post,
Body,
Param,
Delete,
Patch,
} from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { create } from 'domain';

@Controller('tasks')
export class TasksController {
constructor(private readonly tasksService: TasksService) {}

@Get()
getAllTasks(): Task[] {
return this.tasksService.getAllTasks();
}

// This method is used to get a task by its ID
@Get('/:id')
getTaskById(@Param('id') id: string): Task {
return this.tasksService.getTaskById(id);
}

@Post()
createTask(@Body() createTaskDto: CreateTaskDto): Task {
return this.tasksService.createTask(createTaskDto);
}

@Delete('/:id')
deleteTask(@Param('id') id: string): void {
return this.tasksService.deleteTask(id);
}

@Patch('/:id/status')
updateTaskStatus(
@Param('id') id: string,
@Body('status') status: TaskStatus,
): Task {
return this.tasksService.updateTaskStatus(id, status);
}
}

# filter and search: we create a dto for that: get-tasks-filter.dto.ts:

import { TaskStatus } from '../task.model';

export class GetTaskFilterDto {
  status?: TaskStatus; // here we are using ? so that we can search for any one of this
  search?: string;
}

# now i need to check some condition while getting the task: task.controller.ts:

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
    // if we have any filter defined, call taskService.getTaskWithFilter, otherwise just get all task:
    if (Object.keys(filterDto).length) {
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  // This method is used to get a task by its ID
  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }
}


# task.service.ts:
import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    // do something with status:
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }
    return tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}

# task.controller.ts:
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
    // if we have any filter defined, call taskService.getTaskWithFilter, otherwise just get all task:
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTaskWithFilters(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  // This method is used to get a task by its ID
  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }
}



