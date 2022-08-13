import React, { useEffect, useRef } from 'react';
import { useState } from "react";

import fetchUsersAndRepos from "./fetchUsersAndRepos";

interface Props {
  token?: string,
}

const GithubSearch: React.FC<Props> = ({ token }) => {
  const [inputVal, setInputVal] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const timeoutId = useRef<NodeJS.Timeout>();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputVal(e.target.value);
  }

  useEffect(() => {
    clearTimeout(timeoutId.current);

    if (inputVal.trim().length < 3) {
      setSearchResults([]);
      setIsFetching(false);
      return;
    }

    // Provide feedback to the user as they type to improve user experience
    // whether or not data is actually being fetched
    setIsFetching(true);

    timeoutId.current = setTimeout(async () => {
      try {
        const data = await fetchUsersAndRepos(inputVal, token);

        if (data) {
          setSearchResults(data);
        }
      } catch (err) {
        console.log(err);
      }

      setIsFetching(false);
    }, 500);
  }, [inputVal]);

  return (
    <>
      <h1>GitHub Search</h1>
      <input
        type="search"
        value={inputVal}
        onChange={handleChange}
      />
      <div>
        {isFetching ? <p>Searching...</p> : null}
      </div>
      <ul>
        {searchResults ? searchResults.map((item, index) => {
          const content = item.login ? item.login : item.full_name;
          return <li key={index}>{content}</li>;
        }) : null}
      </ul>
    </>
  );
};

export default GithubSearch;
