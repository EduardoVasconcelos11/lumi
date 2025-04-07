import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useDashboardStore } from "../../hooks/use-dashboard-store"

export function DashboardFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { setFilters } = useDashboardStore()

  const getDateFromSearchParams = (key: string): Date | undefined => {
    const value = searchParams.get(key)
    return value ? new Date(value) : undefined
  }

  const [values, setValues] = useState({
    clientNumber: searchParams.get("clientNumber") || "",
    startDate: getDateFromSearchParams("startDate"),
    endDate: getDateFromSearchParams("endDate"),
  })

  // Apply filters when values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters(values)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [values])

  const applyFilters = (filters: { clientNumber: string; startDate?: Date; endDate?: Date }) => {
    const params = new URLSearchParams()

    if (filters.clientNumber) {
      params.set("clientNumber", filters.clientNumber)
    }

    if (filters.startDate) {
      params.set("startDate", filters.startDate.toISOString())
    }

    if (filters.endDate) {
      params.set("endDate", filters.endDate.toISOString())
    }

    setSearchParams(params)

    setFilters({
      clientNumber: filters.clientNumber,
      startDate: filters.startDate,
      endDate: filters.endDate,
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="clientNumber">Nº do Cliente</Label>
            <Input
              id="clientNumber"
              placeholder="Digite o número do cliente"
              value={values.clientNumber}
              onChange={(e) => setValues({ ...values, clientNumber: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label>Data Inicial</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !values.startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {values.startDate ? format(values.startDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={values.startDate}
                  onSelect={(date) => setValues({ ...values, startDate: date || undefined })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>Data Final</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !values.endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {values.endDate ? format(values.endDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={values.endDate}
                  onSelect={(date) => setValues({ ...values, endDate: date || undefined })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
