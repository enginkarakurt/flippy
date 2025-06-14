import { useState, useEffect } from 'react'
import FlipTable from './components/FlipTable'
import Statistics from './components/Statistics'
import Header from './components/Header'
import ThemeProvider from './components/theme-provider'

function App(): React.JSX.Element {
  const [flips, setFlips] = useState([])

  async function fetchFlips(): Promise<void> {
    const flipsData = await window.db.getFlips()
    setFlips(flipsData)
  }

  useEffect(() => {
    fetchFlips()
  }, [])

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const data = await fetch('https://chisel.weirdgloop.org/gazproj/gazbot/os_dump.json')

        if (!data.ok) {
          throw new Error(`Response status: ${data.status}`)
        }

        const json = await data.json()
        localStorage.setItem('bulkData', JSON.stringify(json))
      } catch (error: any) {
        console.error(error.message)
      }
    }

    fetchData()
  }, [])

  async function handleAddFlip(
    name: string,
    amount: number,
    buy_price: number,
    sell_price: number,
    tax?: number
  ): Promise<void> {
    const query = `INSERT INTO flips (name, amount, buy_price, sell_price, tax, created_at) VALUES ('${name}', ${amount}, ${buy_price}, ${sell_price}, ${tax || 'NULL'}, datetime('now', 'localtime'))`
    await window.db.exec(null, query)
    console.log('Flip added!')

    fetchFlips()
  }

  async function handleEditFlip(
    id: number,
    name: string,
    amount: number,
    buy_price: number,
    sell_price: number,
    tax?: number
  ): Promise<void> {
    const query = `UPDATE flips SET name = '${name}', amount = ${amount}, buy_price = ${buy_price}, sell_price = ${sell_price}, tax = ${tax || 'NULL'} WHERE flip_id = ${id}`
    await window.db.exec(null, query)
    console.log('Flip updated!')

    fetchFlips()
  }

  async function handleRemoveFlip(id: number): Promise<void> {
    const deleteQuery = `DELETE FROM flips WHERE flip_id = ${id}`
    await window.db.exec(null, deleteQuery)
    console.log('Flip removed!')

    fetchFlips()
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <main className="grid gap-8 p-4">
        <Statistics flips={flips} />
        <section className="grid gap-2">
          <h2 className="text-2xl font-semibold">Flips:</h2>
          <FlipTable
            flips={flips}
            addFlipCallFunction={handleAddFlip}
            editFlipCallFunction={handleEditFlip}
            removeFlipCallFunction={handleRemoveFlip}
          />
        </section>
      </main>
    </ThemeProvider>
  )
}

export default App
