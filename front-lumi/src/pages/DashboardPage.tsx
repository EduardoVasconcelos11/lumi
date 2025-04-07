import { EnergyResultsChart } from "../components/dashboard/energy-results-chart"
import { FinancialResultsChart } from "../components/dashboard/financial-results-chart"
import { SummaryCards } from "../components/dashboard/summary-cards"

function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Visualize o consumo de energia e resultados financeiros</p>
      </div>

      <div className="mt-8">
        <SummaryCards />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <EnergyResultsChart />
        <FinancialResultsChart />
      </div>
    </div>
  )
}

export default DashboardPage

