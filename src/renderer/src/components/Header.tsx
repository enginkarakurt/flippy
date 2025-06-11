import ThemeToggle from './ThemeToggle'

function Header(): React.JSX.Element {
  return (
    <header className="p-4 flex flex-row justify-between items-center border-b-1">
      <div className="flex justify-center items-end">
        <h1 className="text-4xl font-bold text-blue-500">Flippy</h1>
        <p>v1.0.0</p>
      </div>
      <ThemeToggle />
    </header>
  )
}

export default Header
