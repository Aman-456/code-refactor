import { Test, TestingModule } from '@nestjs/testing';
import { QueryUsersDto } from './dto/query-users.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import type { User } from './user.types';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<Pick<UsersService, 'findPaginated'>>;

  const mockUser: User = {
    id: '1',
    name: 'User 1',
    role: 'Member',
    status: 'Offline',
    lastLogin: new Date().toISOString(),
  };

  beforeEach(async () => {
    service = {
      findPaginated: jest.fn().mockReturnValue({
        data: [mockUser],
        total: 1,
        page: 1,
        limit: 20,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('returns success payload with service result', () => {
      const query: QueryUsersDto = { page: 2, limit: 10, q: 'test' };
      const result = controller.findAll(query);

      expect(service.findPaginated).toHaveBeenCalledWith(2, 10, 'test');
      expect(result).toEqual({
        success: true,
        data: [mockUser],
        total: 1,
        page: 1,
        limit: 20,
      });
    });

    it('passes undefined query fields to the service', () => {
      const query = new QueryUsersDto();
      controller.findAll(query);

      expect(service.findPaginated).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
      );
    });
  });
});
