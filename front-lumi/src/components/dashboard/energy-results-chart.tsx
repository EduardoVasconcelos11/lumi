"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem } from "../ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useDashboardStore } from "../../hooks/use-dashboard-store"
import { fetchEnergyData } from "../../services/dashboard-service"

export function EnergyResultsChart() {
  const { filters } = useDashboardStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const result = await fetchEnergyData(filters)
        setData(result)
      } catch (error) {
        console.error("Error loading energy data:", error)
        // In a real app, you would handle this error properly
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [filters])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados de Energia (kWh)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p>Carregando dados...</p>
          </div>
        ) : (
          <Chart className="h-[300px]">
            <ChartLegend>
              <ChartLegendItem name="Consumo de Energia Elétrica" color="#4f46e5" />
              <ChartLegendItem name="Energia Compensada" color="#10b981" />
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
                    tickFormatter={(value) => `${value} kWh`}
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
                                label: "Consumo",
                                value: `${payload[0].value} kWh`,
                                color: "#4f46e5",
                              },
                              {
                                label: "Compensada",
                                value: `${payload[1].value} kWh`,
                                color: "#10b981",
                              },
                            ]}
                          />
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="consumption" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="compensated" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Chart>
        )}
      </CardContent>
    </Card>
  )
}

