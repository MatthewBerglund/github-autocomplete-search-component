async function fetchUsersAndRepos(searchQuery: string) {
  const baseURL = 'https://api.github.com/search/';
  const usersURL = baseURL + `users?q=${encodeURIComponent(`${searchQuery} in:login`)}&per_page=100`;
  const reposURL = baseURL + `repositories?q=${encodeURIComponent(`${searchQuery} in:name`)}&per_page=100`;

  try {
    const [usersRes, reposRes] = await Promise.all([fetch(usersURL), fetch(reposURL)]);

    if (!usersRes.ok || !reposRes.ok) {
      throw new Error('Unable to fetch');
    }

    const [users, repos] = await Promise.all([usersRes.json(), reposRes.json()]);
    const items = [...users.items, ...repos.items];

    // Alphabetize users and repos
    items.sort((itemA, itemB) => {
      const nameA: string = itemA.name ? itemA.name.toUpperCase() : itemA.login.toUpperCase();
      const nameB: string = itemB.name ? itemB.name.toUpperCase() : itemB.login.toUpperCase();

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
    console.error(err);
  }
}

export default fetchUsersAndRepos;
