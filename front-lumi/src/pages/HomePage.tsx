import { Link } from "react-router-dom"
import { BarChart3, FileText } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

function HomePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao Energy Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitore o consumo de energia e resultados financeiros</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </CardTitle>
            <CardDescription>
              Visualize gráficos e métricas de consumo de energia e resultados financeiros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Acesse gráficos detalhados de consumo de energia e resultados financeiros, com filtros por cliente e
              período.
            </p>
            <Button asChild>
              <Link to="/dashboard">Acessar Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Biblioteca de Faturas
            </CardTitle>
            <CardDescription>Acesse e faça download das faturas de energia elétrica</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Selecione um cliente e um mês específico para visualizar e baixar faturas de energia elétrica.
            </p>
            <Button asChild>
              <Link to="/faturas">Acessar Biblioteca</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HomePage

