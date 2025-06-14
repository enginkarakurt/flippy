import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Edit } from 'lucide-react'
import ItemSearchResults from './ItemSearchResults'

function EditFlipDialog({ flip, callFunction }) {
  const [editedFlip, setEditedFlip] = useState({
    name: flip.name,
    amount: flip.amount.toString(),
    buyPrice: flip.buy_price.toString(),
    sellPrice: flip.sell_price.toString(),
    tax: flip.tax ? flip.tax.toString() : ''
  })

  const [open, setOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [inputValue, setInputValue] = useState(flip.name)
  const [showResults, setShowResults] = useState(true)

  const data = Object.values(JSON.parse(localStorage.getItem('bulkData') || '{}'))

  const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  const filterData = useCallback(
    (value) => {
      const results = data.filter((item) => {
        return value && item && item.name && item.name.toLowerCase().includes(value.toLowerCase())
      })
      setSearchResults(results)
    },
    [data]
  )

  const debouncedFilterData = debounce(filterData, 300)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setEditedFlip((prevFlip) => ({
      ...prevFlip,
      [name]: value
    }))
  }

  const handleItemNameChange = (event) => {
    handleInputChange(event)
    setInputValue(event.target.value)
    setShowResults(true)
    debouncedFilterData(event.target.value)
  }

  const handleItemClick = (name: string) => {
    setInputValue(name)
    setEditedFlip((prevFlip) => ({
      ...prevFlip,
      name: name
    }))
    setShowResults(false)
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset form state to original flip values when dialog is closed
      setEditedFlip({
        name: flip.name,
        amount: flip.amount.toString(),
        buyPrice: flip.buy_price.toString(),
        sellPrice: flip.sell_price.toString(),
        tax: flip.tax ? flip.tax.toString() : ''
      })
      setInputValue(flip.name)
      setShowResults(false)
    }
  }

  function editFlip(event) {
    event.preventDefault()
    if (
      editedFlip.name.trim() === '' ||
      editedFlip.amount === '' ||
      editedFlip.buyPrice === '' ||
      editedFlip.sellPrice === ''
    ) {
      return
    }

    callFunction(
      flip.flip_id,
      editedFlip.name,
      parseInt(editedFlip.amount),
      parseInt(editedFlip.buyPrice),
      parseInt(editedFlip.sellPrice),
      editedFlip.tax ? parseInt(editedFlip.tax) : undefined
    )

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={'outline'}>
          <Edit /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Flip</DialogTitle>
        </DialogHeader>
        <form onSubmit={editFlip}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Item Name</Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={inputValue}
                  onChange={handleItemNameChange}
                />
                <ItemSearchResults
                  results={searchResults}
                  setInputValue={handleItemClick}
                  showResults={showResults}
                />
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min={1}
                max={2147483647}
                step={1}
                value={editedFlip.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="buyPrice">Bought for</Label>
              <Input
                id="buyPrice"
                name="buyPrice"
                type="number"
                min={1}
                max={2147483647}
                step={1}
                value={editedFlip.buyPrice}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sellPrice">Sold for</Label>
              <Input
                id="sellPrice"
                name="sellPrice"
                type="number"
                min={1}
                max={2147483647}
                step={1}
                value={editedFlip.sellPrice}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tax">Tax (optional)</Label>
              <Input
                id="tax"
                name="tax"
                type="number"
                min={1}
                max={2147483647}
                step={1}
                value={editedFlip.tax}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditFlipDialog
