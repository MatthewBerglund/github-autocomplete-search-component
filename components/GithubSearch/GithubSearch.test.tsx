import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import 'whatwg-fetch';

import GithubSearch from './GithubSearch';

const server = setupServer(
  rest.get('https://api.github.com/search/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        items: [
          { login: 'userA' },
          { login: 'userB' },
          { login: 'userC' },
        ]
      }),
    )
  }),
  rest.get('https://api.github.com/search/repositories', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        items: [
          { full_name: 'userD/repoA' },
          { full_name: 'userE/repoB' },
          { full_name: 'userF/repoC' },
        ]
      }),
    )
  }),
)

beforeEach(() => {
  server.listen();
});

afterEach(() => {
  server.close();
  server.resetHandlers();
  cleanup();
});

test('it should not submit a search unless search query is at least 3 chars long', async () => {
  render(<GithubSearch onShowAllClick={(suggestions) => { }} />);

  const input = screen.getByRole('searchbox');

  await userEvent.type(input, 'be');
  expect(screen.queryByText(/searching\.\.\./i)).toBeNull();
});

test('it should provide visual feedback when fetching data', async () => {
  render(<GithubSearch onShowAllClick={(suggestions) => { }} />);

  const input = screen.getByRole('searchbox');

  await userEvent.type(input, 'berg');
  expect(screen.getByText(/searching\.\.\./i)).toBeVisible();
});

test('it should provide visual feedback when results are empty', async () => {
  server.use(
    rest.get('https://api.github.com/search/users', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ items: [] }));
    }),
    rest.get('https://api.github.com/search/repositories', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ items: [] }));
    })
  );

  render(<GithubSearch onShowAllClick={(suggestions) => { }} />);

  const input = screen.getByRole('searchbox');

  await userEvent.type(input, 'berg');
  await waitFor(() => expect(screen.getByText(/0 results found\./i)).toBeVisible());
});

test('it should provide visual feedback if an error occurs', async () => {
  server.use(
    rest.get('https://api.github.com/search/users', (req, res, ctx) => {
      return res(ctx.status(403));
    }),
    rest.get('https://api.github.com/search/repositories', (req, res, ctx) => {
      return res(ctx.status(403));
    }));

  render(<GithubSearch onShowAllClick={(suggestions) => { }} />);

  const input = screen.getByRole('searchbox');

  try {
    await userEvent.type(input, 'berg');
  } catch (err) {
    expect(screen.getByText(/unable to retrieve data\. please try again later\./i)).toBeVisible();
  }
});

test('it should display the correct number of suggestions', async () => {
  render(<GithubSearch onShowAllClick={(suggestions) => { }} />);

  const input = screen.getByRole('searchbox');

  await userEvent.type(input, 'berg');
  await waitFor(() => expect(screen.getAllByTestId('suggestion-li').length).toBe(5));
});
