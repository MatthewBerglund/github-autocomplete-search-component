import React from 'react';

import Suggestion from './Suggestion';
import DisplayAllButton from './DisplayAllButton';
import { UserData, RepoData } from './scripts/fetchUsersAndRepos';

interface Props {
  suggestions: (UserData | RepoData)[],
  numSuggestionsToDisplay: number,
  selectedIndex: number,
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>,
  displayAllSuggestions: () => void,
  clearSearch: () => void,
}

const SuggestionList: React.FC<Props> = ({
  suggestions,
  numSuggestionsToDisplay,
  selectedIndex,
  setSelectedIndex,
  displayAllSuggestions,
  clearSearch
}) => {
  return (
    <ul className="max-h-fit" data-testid="suggestion-list">
      {suggestions.map((item, index) => {
        if (index < numSuggestionsToDisplay) {
          return (
            <li key={index} className="min-h-14 border-t" data-testid="suggestion-li">
              <Suggestion
                index={index}
                type={'login' in item ? 'user' : 'repo'}
                content={'login' in item ? item.login : item.full_name}
                url={item.html_url}
                isSelected={selectedIndex === index}
                setSelectedIndex={setSelectedIndex}
              />
            </li>
          );
        }
      })}
      {suggestions.length > numSuggestionsToDisplay ? (
        <li key={numSuggestionsToDisplay}>
          <DisplayAllButton
            isSelected={selectedIndex === numSuggestionsToDisplay}
            onMouseOver={() => setSelectedIndex(numSuggestionsToDisplay)}
            onClick={() => {
              displayAllSuggestions();
              clearSearch();
            }}
          />
        </li>
      ) : null}
    </ul>
  );
};

export default SuggestionList;
