import type { NextPage } from 'next'
import { useState } from 'react';

import GithubSearch from '../components/GithubSearch'

const Home: NextPage = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  function myCallback(suggestions: any[]) {
    setSuggestions(suggestions);
  }

  return (
    <>
      <div className="flex justify-center align-top py-6 bg-green-400 my-0 mx-auto">
        <div className="w-96 h-12">
          <GithubSearch
            token={process.env.NEXT_PUBLIC_GITHUB_PAT}
            suggestionsLength={5}
            displayFullResultsCallback={myCallback}
          />
        </div>
      </div>
      <div className="flex justify-center my-10">
        <ul className="">
          {suggestions.map(suggestion => (
            <li className="my-3 p-4 bg-slate-100">{suggestion.login || suggestion.full_name}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Home
