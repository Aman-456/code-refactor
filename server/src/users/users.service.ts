import { Injectable } from '@nestjs/common';
import type { User } from './user.types';

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = this.generateMockUsers();
  }

  private generateMockUsers(): User[] {
    const users: User[] = [];
    for (let i = 1; i <= 5000; i++) {
      users.push({
        id: i.toString(),
        name: `User ${i}`,
        role: i % 3 === 0 ? 'Admin' : 'Member',
        status: i % 2 === 0 ? 'Active' : 'Offline',
        lastLogin: new Date(
          Date.now() - Math.random() * 10000000000,
        ).toISOString(),
      });
    }
    return users;
  }

  findPaginated(
    pageInput: number | undefined,
    limitInput: number | undefined,
    q?: string,
  ): { data: User[]; total: number; page: number; limit: number } {
    let page =
      typeof pageInput === 'number' && Number.isFinite(pageInput)
        ? Math.floor(pageInput)
        : 1;
    let limit =
      typeof limitInput === 'number' && Number.isFinite(limitInput)
        ? Math.floor(limitInput)
        : 20;

    page = Math.max(1, page);
    limit = Math.min(100, Math.max(1, limit));

    const needle = (q ?? '').trim().toLowerCase();
    const filtered = needle
      ? this.users.filter(
          (u) =>
            u.name.toLowerCase().includes(needle) ||
            u.role.toLowerCase().includes(needle) ||
            u.status.toLowerCase().includes(needle),
        )
      : this.users;

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, total, page, limit };
  }
}
