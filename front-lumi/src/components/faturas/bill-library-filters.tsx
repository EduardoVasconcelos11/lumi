"use client"

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
import { useBillLibraryStore } from "../../hooks/use-bill-library-store"

export function BillLibraryFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { setFilters } = useBillLibraryStore()

  const [values, setValues] = useState({
    clientNumber: searchParams.get("clientNumber") || "",
    month: searchParams.get("month") ? new Date(searchParams.get("month")) : undefined,
  })

  // Apply filters when values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters(values)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [values])

  const applyFilters = (filters) => {
    // Update URL with filter values
    const params = new URLSearchParams()

    if (filters.clientNumber) {
      params.set("clientNumber", filters.clientNumber)
    }

    if (filters.month) {
      params.set("month", filters.month.toISOString())
    }

    setSearchParams(params)

    // Update global state
    setFilters({
      clientNumber: filters.clientNumber,
      month: filters.month,
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="clientNumber">Nº do Cliente</Label>
            <Input
              id="clientNumber"
              placeholder="Digite o número do cliente"
              value={values.clientNumber || ""}
              onChange={(e) => setValues({ ...values, clientNumber: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label>Mês da Fatura</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !values.month && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {values.month ? format(values.month, "MMMM yyyy", { locale: ptBR }) : "Selecione um mês"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={values.month}
                  onSelect={(date) => setValues({ ...values, month: date || undefined })}
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

