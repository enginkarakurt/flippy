import ThemeToggle from './ThemeToggle'

function Header(): React.JSX.Element {
  return (
    <header className="p-4 flex flex-row justify-between items-center border-b-1">
      <h1 className="text-4xl font-bold text-blue-500">Flippy</h1>
      <ThemeToggle />
    </header>
  )
}

export default Header
