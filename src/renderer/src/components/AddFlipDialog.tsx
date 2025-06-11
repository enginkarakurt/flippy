import { useState } from 'react'
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
import { Plus } from 'lucide-react'

function AddFlipDialog({ callFunction }): React.JSX.Element {
  const [newFlip, setNewFlip] = useState({
    name: '',
    amount: '',
    buyPrice: '',
    sellPrice: '',
    tax: ''
  })

  const [open, setOpen] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewFlip((prevFlip) => ({
      ...prevFlip,
      [name]: value
    }))
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function addFlip(event) {
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
    <Dialog open={open} onOpenChange={setOpen}>
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
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={newFlip.name}
                onChange={handleInputChange}
              />
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
