import { calculateProfit, getProfitColor } from '@renderer/util/profitUtil'
import { Badge } from './ui/badge'

function Statistics({ flips }): React.JSX.Element {
  function calculateTotalProfit(): number {
    return flips.reduce((total, flip) => total + calculateProfit(flip), 0)
  }

  return (
    <section className="grid gap-2">
      <h2 className="text-2xl font-semibold">Statistics:</h2>
      {flips.length === 0 ? (
        <p>No flips have been recorded yet!</p>
      ) : (
        <>
          <p>
            Total Profit:{' '}
            <Badge className={getProfitColor(calculateTotalProfit(), true)}>
              {calculateTotalProfit()} GP
            </Badge>
          </p>
          <p>
            Total Flips: <Badge>{flips.length}</Badge>
          </p>
        </>
      )}
    </section>
  )
}

export default Statistics
