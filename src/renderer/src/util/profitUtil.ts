export function calculateProfit(flip): number {
  const { amount, buy_price, sell_price, tax } = flip
  return (sell_price - buy_price) * amount - (tax || 0)
}

export function getProfitColor(profit: number, background: boolean): string {
  const greenColor: string = background ? 'bg-green-500' : 'text-green-500'
  const redColor: string = background ? 'bg-red-500' : 'text-red-500'

  if (profit > 0) {
    return greenColor
  } else if (profit < 0) {
    return redColor
  } else {
    return ''
  }
}
