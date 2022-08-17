import React, { useCallback, useRef, useState } from 'react';

import Input from './Input';
import Suggestion from './Suggestion';
import Feedback from './Feedback';

import fetchUsersAndRepos from "./fetchUsersAndRepos";

interface Props {
  token?: string,
  numSuggestionsToDisplay?: number,
  displayFullResultsCallback: (suggestions: any[]) => void,
}

const GithubSearch: React.FC<Props> = ({ token, numSuggestionsToDisplay = 5, displayFullResultsCallback }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [didErrorOccur, setDidErrorOccur] = useState(false);

  const timeoutId = useRef<NodeJS.Timeout>();

  const initiateSearch = useCallback((query: string) => {
    // Fetching is indicated to user as they type
    // whether or not data is actually being fetched
    // as a means to improve user experience
    setIsFetching(true);
    setDidErrorOccur(false);
    clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(async () => {
      try {
        const data = await fetchUsersAndRepos(query, token);
        if (data) {
          setSuggestions(data);
          setSelectedIndex(0);
        };
      } catch (err) {
        console.error(err);
        setDidErrorOccur(true);
      }
      setIsFetching(false);
    }, 500);
  }, []);

  const clearSearch = useCallback(() => {
    clearTimeout(timeoutId.current);
    setSuggestions(null);
    setIsFetching(false);
    setSelectedIndex(0);
    setDidErrorOccur(false);
  }, []);

  const navigateSuggestions = (keyboardEventCode: string) => {
    if (suggestions) {
      switch (keyboardEventCode) {
        case 'ArrowDown':
          if (suggestions.length > selectedIndex) {
            setSelectedIndex(i => i + 1);
          }
          break;
        case 'ArrowUp':
          if (selectedIndex > 0) {
            setSelectedIndex(i => i - 1);
          }
          break;
        case 'Enter':
          if (selectedIndex === numSuggestionsToDisplay) {
            displayFullResultsCallback(suggestions);
            clearSearch();
          } else {
            const selectedSuggestion = suggestions[selectedIndex];
            window.open(selectedSuggestion.html_url, '_blank');
            break;
          }
      }
    }
  };

  return (
    <div className="w-full max-w-full h-fit border border-grey-400 bg-white relative z-10">
      <Input
        clearSearch={clearSearch}
        initiateSearch={initiateSearch}
        navigateSuggestions={navigateSuggestions}
      />
      {isFetching ? (
        <Feedback type="info" msg="Searching..." />
      ) : didErrorOccur ? (
        <Feedback type="error" msg="Unable to retrieve data. Please try again later." />
      ) : suggestions && suggestions.length === 0 ? (
        <Feedback type="info" msg="0 results found." />
      ) : null}
      {suggestions && suggestions.length > 0 ? (
        <ul className="max-h-fit">
          {suggestions.map((item, index) => {
            if (index < numSuggestionsToDisplay) {
              return (
                <Suggestion
                  key={index}
                  index={index}
                  type={item.login ? 'user' : 'repo'}
                  content={item.login || item.full_name}
                  url={item.html_url}
                  isSelected={selectedIndex === index}
                  setSelectedIndex={setSelectedIndex}
                />
              );
            }
          })}
          {suggestions.length > numSuggestionsToDisplay ? (
            <li>
              <button
                type="button"
                id="display-all-button"
                className={`${selectedIndex === numSuggestionsToDisplay ? 'bg-blue-100' : ''} w-full p-4 border-t text-blue-600`}
                onClick={() => {
                  displayFullResultsCallback(suggestions);
                  clearSearch();
                }}
                onMouseOver={() => setSelectedIndex(numSuggestionsToDisplay)}
              >
                Show more suggestions
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
};

export default GithubSearch;
