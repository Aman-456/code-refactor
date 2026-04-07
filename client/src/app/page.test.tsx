import { render, screen } from '@testing-library/react';
import Home from './page';

jest.mock('@/components/user-directory/UserDirectory', () => ({
  UserDirectory: function MockUserDirectory() {
    return <div data-testid="user-directory">User directory</div>;
  },
}));

describe('Home page', () => {
  it('renders the directory once the suspense boundary resolves', async () => {
    render(<Home />);

    expect(await screen.findByTestId('user-directory')).toBeInTheDocument();
    expect(screen.getByText('User directory')).toBeInTheDocument();
  });
});
