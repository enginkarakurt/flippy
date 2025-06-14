function ItemSearchResults({ results, setInputValue, showResults }): React.JSX.Element {
  function handleItemClick(name: string): void {
    setInputValue(name)
  }

  if (!showResults) {
    return null
  }

  return results.length === 0 ? (
    ''
  ) : (
    <ul
      id="searchResults"
      className="w-full max-h-64 absolute top-8 bg-background z-10 flex flex-col shadow-2xl border-2 rounded-lg mt-2 overflow-y-scroll"
    >
      {results.map((item: Item, id: number) => {
        const regExSpace = new RegExp(' ', 'g')
        const regExAnd = new RegExp('&amp;', 'g')
        const iconUrl = item.icon
          ? `https://oldschool.runescape.wiki/images/${item.icon
              .replace(regExSpace, '_')
              .replace(regExAnd, '&')}`
          : ''
        return (
          <li key={id} className="border-b-2 last:border-b-0">
            <button
              className="w-full flex items-center gap-4 p-2"
              onClick={() => handleItemClick(item.name)}
            >
              {iconUrl && <img loading="lazy" src={iconUrl} alt={item.name} />}
              {item.name}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default ItemSearchResults
