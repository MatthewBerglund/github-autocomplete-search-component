import type { NextPage } from 'next'

import GithubSearch from '../lib/GithubSearch/GithubSearch'

const Home: NextPage = () => {
  return (
    <GithubSearch token={process.env.NEXT_PUBLIC_GITHUB_PAT} />
  )
}

export default Home
