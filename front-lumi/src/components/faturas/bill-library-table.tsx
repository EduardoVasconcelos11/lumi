import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { useBillLibraryStore } from "../../hooks/use-bill-library-store"
import { fetchBills, fetchBillsPdf } from "../../services/bill-service"

export function BillLibraryTable({ tableKey }: { tableKey?: number }) {
  const { filters } = useBillLibraryStore()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const result = await fetchBills(filters)
        setBills(result)
      } catch (error) {
        console.error("Error loading bills:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [filters, tableKey]) // <- tableKey agora força recarregamento

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, "dd/MM/yyyy", { locale: ptBR })
  }

  const handleDownload = async (filename) => {
    return await fetchBillsPdf(filename);
  }

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p>Carregando faturas...</p>
      </div>
    )
  }

  if (bills.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">Nenhuma fatura encontrada. Tente ajustar os filtros.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nº do Cliente</TableHead>
            <TableHead>Mês de Referência</TableHead>
            <TableHead>Data de Emissão</TableHead>
            <TableHead>Data de Vencimento</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.id}>
              <TableCell>{bill.clientNumber}</TableCell>
              <TableCell>{bill.month}</TableCell>
              <TableCell>{formatDate(bill.issueDate)}</TableCell>
              <TableCell>{formatDate(bill.dueDate)}</TableCell>
              <TableCell>{formatCurrency(bill.totalAmount)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {console.log(bill); handleDownload(bill.filename)}}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
