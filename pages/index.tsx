import type { NextPage } from 'next'

import GithubSearch from '../components/GithubSearch'

const Home: NextPage = () => {
  return (
    <div className="flex justify-center align-top py-6 bg-green-400 my-0 mx-auto">
      <div className="w-96 h-12">
        <GithubSearch token={process.env.NEXT_PUBLIC_GITHUB_PAT} />
      </div>
    </div>
  )
}

export default Home