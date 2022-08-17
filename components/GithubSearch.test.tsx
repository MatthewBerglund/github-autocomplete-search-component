import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom';
import GithubSearch from './GithubSearch';
import fetchUsersAndRepos from './fetchUsersAndRepos';

const mockedUserAndRepos = [
  { login: 'a', html_url: 'https://www.github.com' },
  { login: 'b', html_url: 'https://www.github.com' },
  { login: 'c', html_url: 'https://www.github.com' },
  { full_name: 'd/repo', html_url: 'https://www.github.com' },
  { full_name: 'e/repo', html_url: 'https://www.github.com' },
  { full_name: 'f/repo', html_url: 'https://www.github.com' },
];

jest.mock('./fetchUsersAndRepos', () => {
  return {
    __esModule: true,
    default: jest.fn(() => Promise.resolve(mockedUserAndRepos)),
  }
});

test('it should not call fetchUsersAndRepos unless search query is at least 3 characters in length', async () => {
  const user = userEvent.setup({ delay: 0.5 });

  render(<GithubSearch onShowAllClick={() => { }} />);

  const input = screen.getByRole('searchbox');

  await user.type(input, 'be');
  await waitFor(() => expect(fetchUsersAndRepos).toBeCalledTimes(0));

  await user.type(input, 'ber');
  await waitFor(() => expect(fetchUsersAndRepos).toBeCalledTimes(1));
});

test('it should provide visual feedback when data is being fetched', async () => {
  const user = userEvent.setup({ delay: 0.5 });

  render(<GithubSearch onShowAllClick={() => { }} />);

  const input = screen.getByRole('searchbox');

  await user.type(input, 'berg');
  expect(screen.getByText(/searching\.\.\./i)).toBeVisible();
});

test('it should display the correct number of suggestions', async () => {
  const user = userEvent.setup({ delay: 0.5 });

  render(<GithubSearch onShowAllClick={() => { }} />);

  const input = screen.getByRole('searchbox');


  await user.type(input, 'berg');
  await waitFor(() => {
    const suggestionItems = screen.getAllByTestId('suggestion-li');
    expect(suggestionItems.length).toBe(5);
  });
});