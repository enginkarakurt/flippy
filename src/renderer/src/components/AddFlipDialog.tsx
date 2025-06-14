import { useCallback, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import ItemSearchResults from './ItemSearchResults'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from './ui/dialog'
import { Item } from 'electron'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogHeader, DialogFooter } from './ui/dialog'

function AddFlipDialog({ callFunction }): React.JSX.Element {
  const [newFlip, setNewFlip] = useState({
    name: '',
    amount: '',
    buyPrice: '',
    sellPrice: '',
    tax: ''
  })
  const [open, setOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [showResults, setShowResults] = useState(true)

  const data = Object.values(
    JSON.parse(localStorage.getItem('bulkData') || '{}') as Record<number, Item>
  )

  function debounce(func, wait) {
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
    setNewFlip((prevFlip) => ({
      ...prevFlip,
      [name]: value
    }))
  }

  const handleItemNameChange = (event) => {
    handleInputChange(event)
    setInputValue(event.target.value)
    setShowResults(true) // Show results when typing
    debouncedFilterData(event.target.value)
  }

  const handleItemClick = (name: string) => {
    setInputValue(name)
    setShowResults(false) // Hide results when an item is clicked
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (!isOpen) {
      setNewFlip({
        name: '',
        amount: '',
        buyPrice: '',
        sellPrice: '',
        tax: ''
      })
      setInputValue('')
      setShowResults(false)
    }
  }

  function addFlip(event): void {
    event.preventDefault()
    if (
      newFlip.name.trim() === '' ||
      newFlip.amount === '' ||
      newFlip.buyPrice === '' ||
      newFlip.sellPrice === ''
    ) {
      return
    }

    callFunction(
      newFlip.name,
      parseInt(newFlip.amount),
      parseInt(newFlip.buyPrice),
      parseInt(newFlip.sellPrice),
      newFlip.tax ? parseInt(newFlip.tax) : undefined
    )

    setNewFlip({
      name: '',
      amount: '',
      buyPrice: '',
      sellPrice: '',
      tax: ''
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={'default'}>
          <Plus /> Add Flip
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Flip</DialogTitle>
        </DialogHeader>
        <form onSubmit={addFlip}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Item Name</Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={newFlip.name && inputValue}
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
                value={newFlip.amount}
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
                value={newFlip.buyPrice}
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
                value={newFlip.sellPrice}
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
                value={newFlip.tax}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddFlipDialog
