import { Controller, Get, Query } from '@nestjs/common';
import { QueryUsersDto } from './dto/query-users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: QueryUsersDto) {
    const { data, total, page, limit } = this.usersService.findPaginated(
      query.page,
      query.limit,
      query.q,
    );
    return {
      success: true,
      data,
      total,
      page,
      limit,
    };
  }
}
