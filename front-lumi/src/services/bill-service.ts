// services/faturaService.js
import { api } from "./api";

export async function fetchBills() {
  try {
    const response = await api.get("/invoices/");
    const data = response.data;

    return data.map((item: { id: any; clientNumber: any; referenceMonth: any; createdAt: any; energiaEletricaReais: string; energiaSCEEReais: string; energiaCompensadaReais: string; contribuicaoIlumReais: string; filename: any; }) => ({
      id: item.id,
      clientNumber: item.clientNumber,
      month: item.referenceMonth,
      issueDate: item.createdAt,
      dueDate: null,
      totalAmount:
        parseFloat(item.energiaEletricaReais) +
        parseFloat(item.energiaSCEEReais) +
        parseFloat(item.energiaCompensadaReais) +
        parseFloat(item.contribuicaoIlumReais),
      fileUrl: "#",
      filename: item.filename,
    }));
  } catch (error) {
    console.error("Erro ao buscar faturas:", error);
    return [];
  }
}

export async function fetchBillsPdf(filename: string) {
  try {
    const response = await api.get(`/invoices/download/${filename}`, {
      responseType: 'blob', // 👈 necessário para arquivos
    });

    // Cria um link para download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // 👈 define o nome do arquivo
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Erro ao buscar fatura:", error);
  }
}
