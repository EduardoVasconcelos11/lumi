import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';

export interface InvoiceData {
  clientNumber: string;
  referenceMonth: string;
  energiaEletricaKwh: number;
  energiaEletricaReais: number;
  energiaSCEEEKwh: number;
  energiaSCEEReais: number;
  energiaCompensadaKwh: number;
  energiaCompensadaReais: number;
  contribuicaoIlumReais: number;
}

export async function parseInvoicePDF(filePath: string): Promise<InvoiceData> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  const lines = data.text.split('\n').map(l => l.trim()).filter(Boolean);
  const normalize = (input: string) => input.replace('.', '').replace(',', '.');

  const findNextLineValue = (label: string, digitCount: number = 10): string => {
    const index = lines.findIndex(line => line.includes(label));
    if (index === -1 || index + 1 >= lines.length) throw new Error(`Não encontrado: ${label}`);
    const nextLine = lines[index + 1];
    const match = nextLine.match(new RegExp(`(\\d{${digitCount}})`));
    if (!match) throw new Error(`Número não encontrado após ${label}`);
    return match[1];
  };


  const clientNumber = findNextLineValue('Nº DO CLIENTE');

  const referenceIdx = lines.findIndex(l => l.includes('Referente a'));
  if (referenceIdx === -1 || referenceIdx === lines.length - 1) {
    throw new Error('Mês de referência não encontrado');
  }

  const referenceLine = lines[referenceIdx + 1];

  const referenceRaw = referenceLine.match(/([A-Z]{3}\/\d{4})/i)?.[1];
  if (!referenceRaw) throw new Error('Formato de referência inválido');

  const monthMap: Record<string, string> = {
    JAN: '01', FEV: '02', MAR: '03', ABR: '04', MAI: '05', JUN: '06',
    JUL: '07', AGO: '08', SET: '09', OUT: '10', NOV: '11', DEZ: '12',
  };
  const [mes, ano] = referenceRaw.split('/');
  const referenceMonth = `${monthMap[mes.toUpperCase()]}/${ano}`;

  const energiaEletricaLine = lines.find(l => l.includes('Energia ElétricakWh'));
  if (!energiaEletricaLine) throw new Error('Energia Elétrica não encontrada');
  const matchEletrica = energiaEletricaLine.match(/kWh\s+(\d+)\s+[\d.,]+\s+([\d.,]+)/);
  const energiaEletricaKwh = parseFloat(normalize(matchEletrica![1]));
  const energiaEletricaReais = parseFloat(normalize(matchEletrica![2]));

  const energiaSCEEline = lines.find(l => l.includes('Energia SCEE s/ ICMSkWh'));
  const matchSCEE = energiaSCEEline?.match(/kWh\s+(\d+)\s+[\d.,]+\s+([\d.,]+)/);
  const energiaSCEEEKwh = parseFloat(normalize(matchSCEE![1]));
  const energiaSCEEReais = parseFloat(normalize(matchSCEE![2]));

  const energiaGDline = lines.find(l => l.includes('Energia compensada GD IkWh'));
  const matchGD = energiaGDline?.match(/kWh\s+(\d+)\s+[\d.,]+\s+(-?[\d.,]+)/);
  const energiaCompensadaKwh = parseFloat(normalize(matchGD![1]));
  const energiaCompensadaReais = parseFloat(normalize(matchGD![2]));

  const contribLine = lines.find(l => l.includes('Contrib Ilum Publica Municipal'));
  const matchIlum = contribLine?.match(/([\d.,]+)$/);
  const contribuicaoIlumReais = parseFloat(normalize(matchIlum![1]));

  return {
    clientNumber,
    referenceMonth,
    energiaEletricaKwh,
    energiaEletricaReais,
    energiaSCEEEKwh,
    energiaSCEEReais,
    energiaCompensadaKwh,
    energiaCompensadaReais,
    contribuicaoIlumReais,
  };
}
