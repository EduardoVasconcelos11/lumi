// This is a mock service that would be replaced with actual API calls in a real application

import { api } from "./api"

// Mock data for energy results
export async function fetchEnergyData() {
  // return [
  //   { month: "Jan", consumption: 320, compensated: 180 },
  //   { month: "Fev", consumption: 340, compensated: 190 },
  //   { month: "Mar", consumption: 360, compensated: 200 },
  //   { month: "Abr", consumption: 380, compensated: 210 },
  //   { month: "Mai", consumption: 400, compensated: 220 },
  //   { month: "Jun", consumption: 420, compensated: 230 },
  // ]
  try {
    const response = await api.get("/invoices/findMonth")
    console.log(response.data);
    return response.data
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return {
      totalConsumption: 0,
      totalCompensated: 0,
      totalValueWithoutGD: 0,
      totalGDSavings: 0,
    }
  }
}

// Mock data for financial results
export async function fetchFinancialData(filters: any) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would use the filters to fetch data from your API
  console.log("Fetching financial data with filters:", filters)

  // Return mock data
  return [
    { month: "Jan", totalWithoutGD: 800, gdSavings: 450 },
    { month: "Fev", totalWithoutGD: 850, gdSavings: 475 },
    { month: "Mar", totalWithoutGD: 900, gdSavings: 500 },
    { month: "Abr", totalWithoutGD: 950, gdSavings: 525 },
    { month: "Mai", totalWithoutGD: 1000, gdSavings: 550 },
    { month: "Jun", totalWithoutGD: 1050, gdSavings: 575 },
  ]
}

// Mock data for summary cards
export async function fetchSummaryData(filters: any) {
  try {
    const response = await api.get("/invoices/dash", {
      params: filters,
    })

    const { totalConsumption, totalCompensated, totalValueWithoutGD, totalGDSavings } = response.data

    return {
      totalConsumption,
      totalCompensated,
      totalValueWithoutGD,
      totalGDSavings,
    }
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return {
      totalConsumption: 0,
      totalCompensated: 0,
      totalValueWithoutGD: 0,
      totalGDSavings: 0,
    }
  }
}

