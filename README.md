# GitHub Users and Repos Search Component

A reusable autocomplete search component that searches GitHub for user profiles and repositories. You can [view an example here](https://62fcb25e1b499a006991a71c--reliable-smakager-6316f8.netlify.app/).

![GitHub search component](/assets/github_search_screenshot.png)

Developed with **TypeScript** | **Tailwind CSS** | **Next.js**

# Configuration
The most basic version of the search component takes a callback function for handling the display of the full search results. 

```JS
<GithubSearch onShowAllClick={(suggestions) => setSuggestions(suggestions)} />
```

The component also takes an optional prop for regulating the number of displayed suggestions. If omitted, this value defaults to 5.

```JS
<GithubSearch 
  numSuggestionsToDisplay={10}
  onShowAllClick={(suggestions) => setSuggestions(suggestions)} 
/>
```

A GitHub personal access token can also optionally be passed to the component. Although authorization is not required to search for users and repos, providing a PAT increases the number of effective permissible requests per minute from 5 to 15 and provides a much better user experience.

```JS
<GithubSearch 
  token={process.env.MY_PAT}
  onShowAllClick={(suggestions) => setSuggestions(suggestions)} 
/>
```

# Keyboard Support
Suggestions can be browsed using the following keys:
- *Down*: move down one suggestion
- *Up*: move up one suggestion
- *Enter*: open the selected suggestion in a new tab OR trigger the provided `onShowAllClick` callback
- *Escape*: clear search and remove focus


# Browser Support
The search component is compatible with the latest versions of Chrome and Firefox.

There are a number of known issues with Safari which need to be addressed in the future:
- Clicking individual suggestions or the "Show all suggestions" button does not work properly, as focus event behavior on Safari does not support the component's current implementation.
- Safari's default autocomplete feature in input elements disrupts the user's ability to browse results with the keyboard.

# License
Distributed under the MIT License. See [LICENSE](LICENSE) for more information.