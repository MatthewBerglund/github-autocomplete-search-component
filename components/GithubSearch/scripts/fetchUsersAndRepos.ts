export type UserData = {
  login: string,
  html_url: string,
};

export type RepoData = {
  full_name: string,
  html_url: string,
};

type JSONResponse = {
  items: UserData[] | RepoData[],
};

export async function fetchUsersAndRepos(searchQuery: string, token?: string): Promise<(UserData | RepoData)[]> {
  const baseURL = 'https://api.github.com/search/';
  const usersURL = baseURL + `users?q=${encodeURIComponent(`${searchQuery} in:login`)}&per_page=50`;
  const reposURL = baseURL + `repositories?q=${encodeURIComponent(`${searchQuery} in:name`)}&per_page=50`;

  const requestOptions: RequestInit = { 'method': 'GET' };

  if (token) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    requestOptions.headers = headers;
  }

  try {
    const [userResponse, repoResponse] = await Promise.all([
      fetch(usersURL, requestOptions),
      fetch(reposURL, requestOptions),
    ]);

    if (!userResponse.ok) {
      throw new Error(`Status ${userResponse.status} ${userResponse.statusText}`);
    }

    if (!repoResponse.ok) {
      throw new Error(`Status ${repoResponse.status} ${repoResponse.statusText}`);
    }

    const [users, repos]: JSONResponse[] = await Promise.all([userResponse.json(), repoResponse.json()]);
    const items = [...users.items, ...repos.items];

    // Alphabetize users and repos
    items.sort((itemA, itemB) => {
      const nameA = 'login' in itemA ? itemA.login.toUpperCase() : itemA.full_name.toUpperCase();
      const nameB = 'login' in itemB ? itemB.login.toUpperCase() : itemB.full_name.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    const truncatedItems = items.slice(0, 50);
    return Promise.resolve(truncatedItems);
  } catch (err) {
    return Promise.reject('Unable to fetch data from GitHub. ' + err);
  }
}

export default fetchUsersAndRepos;
