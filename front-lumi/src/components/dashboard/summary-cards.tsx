"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Zap, DollarSign, TrendingDown, Bolt } from "lucide-react"
import { useDashboardStore } from "../../hooks/use-dashboard-store"
import { fetchSummaryData } from "../../services/dashboard-service"

export function SummaryCards() {
  const { filters } = useDashboardStore()
  const [data, setData] = useState({
    totalConsumption: 0,
    totalCompensated: 0,
    totalValueWithoutGD: 0,
    totalGDSavings: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const result = await fetchSummaryData(filters)
        setData(result)
      } catch (error) {
        console.error("Error loading summary data:", error)
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

  const formatEnergy = (value) => {
    return `${value.toLocaleString("pt-BR")} kWh`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consumo Total</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 animate-pulse rounded bg-muted"></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{formatEnergy(data.totalConsumption)}</div>
              <p className="text-xs text-muted-foreground">Energia elétrica consumida</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Energia Compensada</CardTitle>
          <Bolt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 animate-pulse rounded bg-muted"></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{formatEnergy(data.totalCompensated)}</div>
              <p className="text-xs text-muted-foreground">Total de energia compensada</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor sem GD</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 animate-pulse rounded bg-muted"></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{formatCurrency(data.totalValueWithoutGD)}</div>
              <p className="text-xs text-muted-foreground">Valor total sem geração distribuída</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Economia GD</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 animate-pulse rounded bg-muted"></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{formatCurrency(data.totalGDSavings)}</div>
              <p className="text-xs text-muted-foreground">Economia com geração distribuída</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

