import { Flip } from 'src/types/flip'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Input } from './ui/input'
import { calculateProfit, getProfitColor } from '@renderer/util/profitUtil'
import { useState } from 'react'
import AddFlipDialog from './AddFlipDialog'
import RemoveFlipDialog from './RemoveFlipDialog'
import EditFlipDialog from './EditFlipDialog'

function FlipTable({
  flips,
  addFlipCallFunction,
  editFlipCallFunction,
  removeFlipCallFunction
}): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')

  function handleAddFlip(
    name: string,
    amount: number,
    buy_price: number,
    sell_price: number,
    tax?: number
  ): void {
    addFlipCallFunction(name, amount, buy_price, sell_price, tax ? tax : undefined)
  }

  function handleRemoveFlip(id: number) {
    removeFlipCallFunction(id)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const filterFlips = (flips: Flip[], query: string) => {
    if (!query) return flips

    const lowercasedQuery = query.toLowerCase()

    // Check if the query is a profit filter
    const profitFilterMatch = lowercasedQuery.match(/profit\s*(>|<)\s*(\d+)/)
    if (profitFilterMatch) {
      const [, operator, value] = profitFilterMatch
      const profitValue = parseFloat(value)

      return flips.filter((flip: Flip) => {
        const profit = calculateProfit(flip)
        return operator === '>' ? profit > profitValue : profit < profitValue
      })
    }

    // Otherwise, filter by name
    return flips.filter((flip: Flip) => flip.name.toLowerCase().includes(lowercasedQuery))
  }

  const filteredFlips = filterFlips(flips, searchQuery)

  return (
    <>
      <div className="flex flex-row gap-4">
        <Input
          type="text"
          id="search"
          placeholder={
            filteredFlips.length === 0
              ? 'Searching will be available when you add a Flip'
              : 'Search by name or profit > value or < value'
          }
          value={searchQuery}
          onChange={handleSearchChange}
          disabled={filteredFlips.length === 0 ? true : false}
        />
        <AddFlipDialog callFunction={handleAddFlip} />
      </div>
      {filteredFlips.length === 0 ? (
        <p className="text-center py-4">No flips have been recorded yet!</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Buy Price</TableHead>
              <TableHead>Sell Price</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFlips.map((flip: Flip) => (
              <TableRow key={flip.flip_id}>
                <TableCell>
                  <img
                    loading="lazy"
                    width={24}
                    height={24}
                    src={
                      'https://oldschool.runescape.wiki/images/' +
                      flip.name.replace(' ', '_') +
                      '.png?cache'
                    }
                  />
                </TableCell>
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
                <TableCell className="text-right min-w-fit w-48 max-w-fit">
                  <div className="flex gap-2">
                    <EditFlipDialog flip={flip} callFunction={editFlipCallFunction} />
                    <RemoveFlipDialog callFunction={handleRemoveFlip} id={flip.flip_id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default FlipTable
