import { useState } from "react";

import fetchUsersAndRepos from "./fetchUsersAndRepos";

const GithubSearch = () => {
  const [inputText, setInputText] = useState('');

  return (
    <>
      <h1>GitHub Search</h1>
      <input
        type="search"
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        onKeyUp={async () => {
          if (inputText.length >= 3) {
            try {
              const data = await fetchUsersAndRepos(inputText);
              console.log(data);
            } catch (err) {
              console.error(err);
            }
          }
        }}
      />
    </>
  );
};

export default GithubSearch;
