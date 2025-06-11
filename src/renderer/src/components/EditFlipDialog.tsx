import { useState, useEffect } from 'react'
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

function EditFlipDialog({ flip, callFunction }): React.JSX.Element {
  const [editedFlip, setEditedFlip] = useState({
    name: '',
    amount: '',
    buyPrice: '',
    sellPrice: '',
    tax: ''
  })

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (flip) {
      setEditedFlip({
        name: flip.name,
        amount: flip.amount.toString(),
        buyPrice: flip.buy_price.toString(),
        sellPrice: flip.sell_price.toString(),
        tax: flip.tax ? flip.tax.toString() : ''
      })
    }
  }, [flip])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setEditedFlip((prevFlip) => ({
      ...prevFlip,
      [name]: value
    }))
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
    <Dialog open={open} onOpenChange={setOpen}>
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
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={editedFlip.name}
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
