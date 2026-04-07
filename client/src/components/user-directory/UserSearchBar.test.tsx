import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserSearchBar } from './UserSearchBar';

describe('UserSearchBar', () => {
  it('submits the current value when Search is clicked', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<UserSearchBar queryParam="" onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox'), 'admin');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith('admin');
  });

  it('calls onSearch with an empty string when the field is cleared', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<UserSearchBar queryParam="foo" onSearch={onSearch} />);

    await user.clear(screen.getByRole('searchbox'));

    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('keeps the input in sync with queryParam from the URL', () => {
    const { rerender } = render(
      <UserSearchBar queryParam="first" onSearch={jest.fn()} />,
    );
    expect(screen.getByRole('searchbox')).toHaveValue('first');

    rerender(<UserSearchBar queryParam="second" onSearch={jest.fn()} />);
    expect(screen.getByRole('searchbox')).toHaveValue('second');
  });
});
