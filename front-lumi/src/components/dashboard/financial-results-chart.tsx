"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem } from "../ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useDashboardStore } from "../../hooks/use-dashboard-store"
import { fetchFinancialData } from "../../services/dashboard-service"

export function FinancialResultsChart() {
  const { filters } = useDashboardStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const result = await fetchFinancialData(filters)
        setData(result)
      } catch (error) {
        console.error("Error loading financial data:", error)
        // In a real app, you would handle this error properly
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [filters])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados Financeiros (R$)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p>Carregando dados...</p>
          </div>
        ) : (
          <Chart className="h-[300px]">
            <ChartLegend>
              <ChartLegendItem name="Valor Total sem GD" color="#f59e0b" />
              <ChartLegendItem name="Economia GD" color="#06b6d4" />
            </ChartLegend>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value)}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent
                            className="border bg-background p-2 shadow-sm"
                            items={[
                              {
                                label: "Valor sem GD",
                                value: formatCurrency(payload[0].value),
                                color: "#f59e0b",
                              },
                              {
                                label: "Economia GD",
                                value: formatCurrency(payload[1].value),
                                color: "#06b6d4",
                              },
                            ]}
                          />
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="totalWithoutGD" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gdSavings" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Chart>
        )}
      </CardContent>
    </Card>
  )
}

