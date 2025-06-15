/* eslint-disable react/prop-types */
import { Flip } from 'src/types/flip'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Input } from './ui/input'
import { calculateProfit, getProfitColor } from '@renderer/util/profitUtil'
import { useState, useEffect, ReactElement, SetStateAction } from 'react'
import AddFlipDialog from './AddFlipDialog'
import RemoveFlipDialog from './RemoveFlipDialog'
import EditFlipDialog from './EditFlipDialog'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from './ui/pagination'
import { Item } from 'electron'

function FlipTable({
  flips,
  addFlipCallFunction,
  editFlipCallFunction,
  removeFlipCallFunction
}): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [bulkData, setBulkData] = useState<Record<number, Item>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('bulkData') || '{}')
    setBulkData(data)
  }, [])

  function handleAddFlip(
    name: string,
    amount: number,
    buy_price: number,
    sell_price: number,
    tax?: number
  ): void {
    addFlipCallFunction(name, amount, buy_price, sell_price, tax ? tax : undefined)
  }

  function handleRemoveFlip(id: number): void {
    removeFlipCallFunction(id)
  }

  function handleSearchChange(event: { target: { value: SetStateAction<string> } }): void {
    setSearchQuery(event.target.value)
    setCurrentPage(1)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function filterFlips(flips: Flip[], query: string) {
    if (!query) return flips

    const lowercasedQuery = query.toLowerCase()

    const profitFilterMatch = lowercasedQuery.match(/profit\s*(>|<)\s*(\d+)/)
    if (profitFilterMatch) {
      const [, operator, value] = profitFilterMatch
      const profitValue = parseFloat(value)

      return flips.filter((flip: Flip) => {
        const profit = calculateProfit(flip)
        return operator === '>' ? profit > profitValue : profit < profitValue
      })
    }

    return flips.filter((flip: Flip) => flip.name.toLowerCase().includes(lowercasedQuery))
  }

  const filteredFlips = filterFlips(flips, searchQuery)

  const getIconUrl = (name: string): string => {
    const item = Object.values(bulkData).find((item) => item.name === name)
    if (item && item.icon) {
      const regExSpace = new RegExp(' ', 'g')
      const regExAnd = new RegExp('&amp;', 'g')
      return `https://oldschool.runescape.wiki/images/${item.icon.replace(regExSpace, '_').replace(regExAnd, '&')}`
    }
    return ''
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredFlips.slice(indexOfFirstItem, indexOfLastItem)

  function paginate(pageNumber: number): void {
    setCurrentPage(pageNumber)
  }

  const totalPages = Math.ceil(filteredFlips.length / itemsPerPage)

  function renderPaginationLinks(): ReactElement[] {
    const links: ReactElement[] = []
    const maxVisiblePages = 3

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink href="#" onClick={() => paginate(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return links
  }

  return (
    <>
      <div className="flex flex-row gap-4">
        {filteredFlips.length > 0 && (
          <Pagination className="w-fit">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                />
              </PaginationItem>
              {currentPage > 3 && (
                <>
                  <PaginationItem>
                    <PaginationLink href="#" onClick={() => paginate(1)}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationEllipsis />
                </>
              )}
              {renderPaginationLinks()}
              {currentPage < totalPages - 2 && (
                <>
                  <PaginationEllipsis />
                  <PaginationItem>
                    <PaginationLink href="#" onClick={() => paginate(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        <Input
          type="text"
          id="search"
          placeholder={
            flips.length === 0
              ? 'Searching will be available when you add a Flip'
              : 'Search by name or profit > value or < value'
          }
          value={searchQuery}
          onChange={handleSearchChange}
          disabled={flips.length === 0}
        />
        <AddFlipDialog callFunction={handleAddFlip} />
      </div>
      {flips.length === 0 ? (
        <p className="text-center py-4">No flips have been recorded yet!</p>
      ) : (
        <>
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
              {filteredFlips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No results found for your search query.
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((flip: Flip) => (
                  <TableRow key={flip.flip_id}>
                    <TableCell>
                      <img
                        loading="lazy"
                        width={24}
                        height={24}
                        src={getIconUrl(flip.name)}
                        alt={flip.name}
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
                ))
              )}
            </TableBody>
          </Table>
          {filteredFlips.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  />
                </PaginationItem>
                {currentPage > 3 && (
                  <>
                    <PaginationItem>
                      <PaginationLink href="#" onClick={() => paginate(1)}>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationEllipsis />
                  </>
                )}
                {renderPaginationLinks()}
                {currentPage < totalPages - 2 && (
                  <>
                    <PaginationEllipsis />
                    <PaginationItem>
                      <PaginationLink href="#" onClick={() => paginate(totalPages)}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </>
  )
}

export default FlipTable
