import { useState } from "react";
import { fetchUsers, fetchRepos } from "./search";

const GithubSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');

  async function search(searchQuery: string): Promise<void> {
    const baseURL = 'https://api.github.com/search/';

    const [userRes, repoRes] = await Promise.all([
      fetch(baseURL + 'users' + `?q=${encodeURIComponent(`${searchQuery} in:login`)}&per_page=100`),
      fetch(baseURL + 'repositories' + `?q=${encodeURIComponent(`${searchQuery} in:name`)}&per_page=100`),
    ]);

    const [users, repos] = await Promise.all([userRes.json(), repoRes.json()]);

    // console.log(users.items);
    // console.log(repos.items);

    const items = [...users.items, ...repos.items];

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

    const filteredItems = items.filter((item, index) => {
      if (index < 50) {
        return item;
      }
    });

    console.log(filteredItems);
  }

  return (
    <>
      <h1>GitHub Search</h1>
      <input
        type="search"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <button onClick={() => fetchUsers(searchQuery)}>Search Users</button>
      <button onClick={() => fetchRepos(searchQuery)}>Search Repos</button>
      <button onClick={() => search(searchQuery)}>Search Both</button>
    </>
  );
};

export default GithubSearch;
