import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

// Flaw 1: Generating a massive dataset in-memory synchronously on load.
// Flaw 2: Business logic is sitting directly inside the controller file instead of a Service.
const generateMockUsers = () => {
  const users = [];
  for (let i = 1; i <= 5000; i++) {
    users.push({
      id: i.toString(),
      name: `User ${i}`,
      role: i % 3 === 0 ? 'Admin' : 'Member',
      status: i % 2 === 0 ? 'Active' : 'Offline',
      lastLogin: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    });
  }
  return users;
};

const database = generateMockUsers();

@Controller('api/users')
export class UsersController {
  @Get()
  async getAllUsers() {
    // Flaw 3: The route completely lacks pagination logic, serving everything at once.
    return new Promise((resolve, reject) => {
      try {
        // Simulating artificial network delay
        setTimeout(() => {
          // Anti-pattern: Sending all 5000 records simultaneously
          resolve({
            success: true,
            count: database.length,
            data: database,
          });
        }, 1500);
      } catch (error) {
        reject(new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR));
      }
    });
  }
}