async function fetchUsersAndRepos(searchQuery: string, token?: string) {
  const baseURL = 'https://api.github.com/searc/';
  const usersURL = baseURL + `users?q=${encodeURIComponent(`${searchQuery} in:login`)}&per_page=50`;
  const reposURL = baseURL + `repositories?q=${encodeURIComponent(`${searchQuery} in:name`)}&per_page=50`;

  const requestOptions: RequestInit = { 'method': 'GET' };

  if (token) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    requestOptions.headers = headers;
  }

  try {
    const [usersRes, reposRes] = await Promise.all([
      fetch(usersURL, requestOptions),
      fetch(reposURL, requestOptions),
    ]);

    if (!usersRes.ok) {
      throw new Error(`Status ${usersRes.status} ${usersRes.statusText}`);
    }

    if (!reposRes.ok) {
      throw new Error(`Status ${reposRes.status} ${reposRes.statusText}`);
    }

    const [users, repos] = await Promise.all([usersRes.json(), reposRes.json()]);
    const items = [...users.items, ...repos.items];

    // Alphabetize users and repos
    items.sort((itemA, itemB) => {
      const nameA: string = itemA.login ? itemA.login.toUpperCase() : itemA.full_name.toUpperCase();
      const nameB: string = itemB.login ? itemB.login.toUpperCase() : itemB.full_name.toUpperCase();

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
