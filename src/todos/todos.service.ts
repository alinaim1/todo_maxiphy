/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './create-todo-dto';
import { PrismaService } from 'src/prisma.service';
import { UpdateTodoDto } from './update-todo-dto';
import { DeleteTodoDto } from './delete-todo-dto';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async createTodo(payload: CreateTodoDto, userId: string) {
    if (userId) {
      const userIsExist = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!userIsExist) {
        throw new NotFoundException('User not found');
      }
    }
    try {
      const todo = await this.prisma.todo.create({
        data: {
          ...payload,
          userId: userId,
        },
      });
      if (!todo) {
        throw new InternalServerErrorException('Todo creation failed');
      }
      return { ...todo, message: 'Todo created successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  // Get all todos for a specific user, ordered by completion status, date, and priority
  async getTodos(userId: string) {
    const todos = await this.prisma.todo.findMany({
      where: { userId },
      orderBy: [
        { completed: 'asc' }, // incomplete (false) first
        { date: 'asc' }, // oldest date first
        { priority: 'desc' }, // high priority first (3 > 1)
      ],
    });

    return todos;
  }
  async updateTodo(userId: string, updateTodoDto: UpdateTodoDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // First, find the todo and make sure it belongs to this user
    const todo = await this.prisma.todo.findFirst({
      where: {
        id: updateTodoDto.id,
        userId: userId,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found or not yours');
    }
    if (todo.completed) {
      throw new ConflictException('Completed todos cannot be updated');
    }

    // Now safe to update
    return await this.prisma.todo.update({
      where: { id: updateTodoDto.id },
      data: updateTodoDto,
    });
  }
  async deleteTodo(userId: string, deleteTodoDto: DeleteTodoDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // First, find the todo and make sure it belongs to this user
    const todo = await this.prisma.todo.findFirst({
      where: {
        id: deleteTodoDto.id,
        userId: userId,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found or not yours');
    }

    try {
      const deletedTodo = await this.prisma.todo.delete({
        where: { id: deleteTodoDto.id },
      });
      if (!deletedTodo) {
        throw new InternalServerErrorException('Todo deletion failed');
      }
      return { message: 'Todo deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  //filter todos by title, description, date, completed, priority with pagination
  async getFilterTodos(
    userId: string,
    filter: {
      title?: string;
      description?: string;
      date?: string;
      completed?: boolean;
      priority?: number;
      page?: number;
      pageSize?: number;
    } = {},
  ) {
    const {
      title,
      description,
      date,
      completed,
      priority,
      page = 1,
      pageSize = 10,
    } = filter;
    console.log(filter);
    const where: any = { userId };

    if (title) where.title = { contains: title, mode: 'insensitive' };
    if (description)
      where.description = { contains: description, mode: 'insensitive' };
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.date = { gte: start, lte: end };
    }
    // Only filter by completed if it's not null/undefined/empty string
    if (typeof completed === 'boolean') where.completed = completed;
    // Only filter by priority if it's not null/undefined, and convert to number
    const priorityNum =
      priority !== undefined && priority !== null
        ? Number(priority)
        : undefined;
    if (priorityNum !== undefined && !isNaN(priorityNum))
      where.priority = priorityNum;

    const pageSizeNum = Number(pageSize) || 10;
    const pageNum = Number(page) || 1;
    const skip = (pageNum - 1) * pageSizeNum;
    const take = pageSizeNum;

    const [todos, total] = await Promise.all([
      this.prisma.todo.findMany({
        where,
        orderBy: [{ completed: 'asc' }, { date: 'asc' }, { priority: 'desc' }],
        skip,
        take,
      }),
      this.prisma.todo.count({ where }),
    ]);

    return {
      data: todos,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
