import { Flip } from 'src/types/flip'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Input } from './ui/input'
import AddFlipDialog from './AddFlipDialog'
import { calculateProfit, getProfitColor } from '@renderer/util/profitUtil'
import { useState } from 'react'
import RemoveFlipDialog from './RemoveFlipDialog'

function FlipTable({ flips, addFlipCallFunction, removeFlipCallFunction }): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')

  function handleAddFlip(
    name: string,
    amount: number,
    buy_price: number,
    sell_price: number,
    tax?: number
  ): Promise<void> {
    addFlipCallFunction(name, amount, buy_price, sell_price, tax ? tax : undefined)
  }

  function handleRemoveFlip(id: number) {
    removeFlipCallFunction(id)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const filterFlips = (flips, query) => {
    if (!query) return flips

    const lowercasedQuery = query.toLowerCase()

    // Check if the query is a profit filter
    const profitFilterMatch = lowercasedQuery.match(/profit\s*(>|<)\s*(\d+)/)
    if (profitFilterMatch) {
      const [, operator, value] = profitFilterMatch
      const profitValue = parseFloat(value)

      return flips.filter((flip) => {
        const profit = calculateProfit(flip)
        return operator === '>' ? profit > profitValue : profit < profitValue
      })
    }

    // Otherwise, filter by name
    return flips.filter((flip) => flip.name.toLowerCase().includes(lowercasedQuery))
  }

  const filteredFlips = filterFlips(flips, searchQuery)

  return (
    <>
      <div className="flex flex-row gap-4">
        <Input
          type="text"
          id="search"
          placeholder="Search by name or profit > value or < value"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <AddFlipDialog callFunction={handleAddFlip} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Buy Price</TableHead>
            <TableHead>Sell Price</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFlips.length === 0 ? (
            <TableRow>No flips have been recorded yet!</TableRow>
          ) : (
            <>
              {filteredFlips.map((flip: Flip) => (
                <TableRow key={flip.flip_id}>
                  <TableCell>{flip.name}</TableCell>
                  <TableCell>{flip.amount}</TableCell>
                  <TableCell>{flip.buy_price}</TableCell>
                  <TableCell>{flip.sell_price}</TableCell>
                  <TableCell>{flip.tax ? flip.tax : 'N/A'}</TableCell>
                  <TableCell>
                    <span className={getProfitColor(calculateProfit(flip), false)}>
                      {calculateProfit(flip)}
                    </span>
                  </TableCell>
                  <TableCell>{flip.created_at}</TableCell>
                  <TableCell className="text-right w-8">
                    <RemoveFlipDialog callFunction={handleRemoveFlip} id={flip.flip_id} />
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </>
  )
}

export default FlipTable
