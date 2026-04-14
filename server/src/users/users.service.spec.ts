import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService();
  });

  describe('findPaginated', () => {
    it('defaults to page 1 and limit 20 when inputs are undefined', () => {
      const result = service.findPaginated(undefined, undefined);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.total).toBe(5000);
      expect(result.data).toHaveLength(20);
      expect(result.data[0].id).toBe('1');
      expect(result.data[19].id).toBe('20');
    });

    it('returns the correct slice for page 2 with limit 10', () => {
      const result = service.findPaginated(2, 10);

      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(5000);
      expect(result.data).toHaveLength(10);
      expect(result.data[0].id).toBe('11');
      expect(result.data[9].id).toBe('20');
    });

    it('clamps limit to max 100', () => {
      const result = service.findPaginated(1, 200);

      expect(result.limit).toBe(100);
      expect(result.data).toHaveLength(100);
    });

    it('clamps limit to min 1', () => {
      const result = service.findPaginated(1, 0);

      expect(result.limit).toBe(1);
      expect(result.data).toHaveLength(1);
    });

    it('does not allow page below 1', () => {
      const result = service.findPaginated(0, 10);

      expect(result.page).toBe(1);
      expect(result.data[0].id).toBe('1');
    });

    it('filters by name substring (case-insensitive)', () => {
      const result = service.findPaginated(1, 50, 'user 5000');

      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('5000');
      expect(result.data[0].name).toBe('User 5000');
    });

    it('filters by role substring', () => {
      const result = service.findPaginated(1, 5000, 'admin');

      expect(result.total).toBe(1666);
      result.data.forEach((u) => {
        expect(u.role).toBe('Admin');
      });
    });

    it('filters by status substring', () => {
      const result = service.findPaginated(1, 100, 'offline');

      expect(result.total).toBe(2500);
      result.data.forEach((u) => {
        expect(u.status).toBe('Offline');
      });
    });

    it('returns empty data when no matches', () => {
      const result = service.findPaginated(1, 20, 'zzzz-no-match-zzzz');

      expect(result.total).toBe(0);
      expect(result.data).toHaveLength(0);
    });

    it('trims search query', () => {
      const withSpaces = service.findPaginated(1, 50, '  user 1  ');
      const trimmed = service.findPaginated(1, 50, 'user 1');

      expect(withSpaces.total).toBe(trimmed.total);
    });

    it('paginates within filtered results', () => {
      const page1 = service.findPaginated(1, 5, 'member');
      const page2 = service.findPaginated(2, 5, 'member');

      expect(page1.data).toHaveLength(5);
      expect(page2.data).toHaveLength(5);
      expect(page1.data[0].id).not.toBe(page2.data[0].id);
    });
  });
});
