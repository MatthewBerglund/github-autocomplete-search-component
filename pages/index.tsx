import type { NextPage } from 'next'
import { useState } from 'react';

import GithubSearch from '../components/GithubSearch'

const Home: NextPage = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Example callback for handling the full list of suggestions
  function displayAllSuggestions(suggestions: any[]) {
    setSuggestions(suggestions);
  }

  return (
    <>
      <div className="flex justify-center align-top py-6 bg-green-400 my-0 mx-auto">
        <div className="w-96 h-12">
          <GithubSearch
            token={process.env.NEXT_PUBLIC_GITHUB_PAT}
            numSuggestionsToDisplay={10}
            fullSuggestionsCallback={displayAllSuggestions}
          />
        </div>
      </div>
      <div className="flex justify-center my-10">
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} className="min-h-14 my-7">
              <a
                href={suggestion.html_url}
                target="_blank"
                rel="noreferrer"
                className={`grid grid-cols-1 items-center justify-items-center bg-slate-100`}
              >
                <span className="p-4 w-full break-words">{suggestion.login || suggestion.full_name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Home
