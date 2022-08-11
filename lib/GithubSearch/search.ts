export async function fetchUsers(name: string) {
  const url = 'https://api.github.com/search/users?'

  const query = 'q=' + encodeURIComponent(`${name} in:login`);
  const perPage = 'per_page=100';



  try {
    const res = await fetch(url + query + '&' + perPage);
    const data = await res.json();
    // console.log(data.items);
  } catch (err) {
    console.log(err);
  }
}

export async function fetchRepos(name: string) {
  const url = 'https://api.github.com/search/repositories?'

  const query = 'q=' + encodeURIComponent(`${name} in:name`);
  const perPage = 'per_page=100';

  try {
    const res = await fetch(url + query + '&' + perPage);
    const data = await res.json();
    // console.log(data.items);
  } catch (err) {
    console.log(err);
  }
}
