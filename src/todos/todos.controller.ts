/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateTodoDto } from './create-todo-dto';
import { TodosService } from './todos.service';
import { AuthGuard } from 'src/users/auth.guard';
import { UpdateTodoDto } from './update-todo-dto';
import { DeleteTodoDto } from './delete-todo-dto';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  async create(
    @Request() req: { user: { id: string } },
    @Body() createTodoDto: CreateTodoDto,
  ) {
    return await this.todosService.createTodo(createTodoDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('/specific')
  async getTodoForUser(@Request() req: { user: { id: string } }): Promise<any> {
    return await this.todosService.getTodos(req.user.id);
  }
  @UseGuards(AuthGuard)
  @Get('/list')
  async getTodoForUserFilter(
    @Request() req: { user: { id: string } },
    @Query() query: any,
  ): Promise<any> {
    return await this.todosService.getFilterTodos(req.user.id, query);
  }
  @UseGuards(AuthGuard)
  @Put('/update')
  async updateTodo(
    @Request() req: { user: { id: string } },
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<any> {
    return await this.todosService.updateTodo(req.user.id, updateTodoDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/delete')
  async deleteTodo(
    @Request() req: { user: { id: string } },
    @Body() deleteTodoDto: DeleteTodoDto,
  ): Promise<any> {
    return await this.todosService.deleteTodo(req.user.id, deleteTodoDto);
  }
}
