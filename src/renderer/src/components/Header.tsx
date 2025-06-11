import ThemeToggle from './ThemeToggle'
function Header(): React.JSX.Element {
  const version = 'v' + import.meta.env.PACKAGE_VERSION
  return (
    <header className="p-4 flex flex-row justify-between items-center border-b-1">
      <div className="flex justify-center items-end">
        <h1 className="text-4xl font-bold text-blue-500">Flippy</h1>
        <p>{version}</p>
      </div>
      <ThemeToggle />
    </header>
  )
}

export default Header
