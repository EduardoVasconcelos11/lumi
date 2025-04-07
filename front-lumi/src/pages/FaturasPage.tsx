import { useState } from "react"
import { BillLibraryFilters } from "../components/faturas/bill-library-filters"
import { BillLibraryTable } from "../components/faturas/bill-library-table"
import { api } from "../services/api"

function FaturasPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [tableKey, setTableKey] = useState(0) // <- usado para forçar rerender

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1]

      try {
        await api.post("/invoices/upload-base64", {
          filename: file.name,
          base64,
        })
        alert("Upload feito com sucesso!")
        setTableKey(prev => prev + 1) // força recarregamento da tabela
      } catch (err) {
        console.error(err)
        alert("Erro ao enviar o arquivo.")
      } finally {
        setIsUploading(false)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Faturas</h1>
        <p className="text-muted-foreground mt-2">Acesse e faça download das faturas de energia elétrica</p>
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-2">Upload de fatura em PDF</label>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        {isUploading && <p className="text-sm text-gray-500 mt-2">Enviando arquivo...</p>}
      </div>

      <BillLibraryFilters />

      <div className="mt-8">
        {/* key faz com que o componente seja recriado */}
        <BillLibraryTable key={tableKey} tableKey={tableKey} />
      </div>
    </div>
  )
}

export default FaturasPage
