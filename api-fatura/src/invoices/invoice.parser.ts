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

  const normalize = (input: string): string =>
    input.replace(/\./g, '').replace(',', '.');

  const findNextLineValue = (label: string, digitCount: number = 10): string => {
    const index = lines.findIndex(line => line.includes(label));
    if (index === -1 || index + 1 >= lines.length)
      throw new Error(`Não encontrado: ${label}`);
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

  // Energia Elétrica
  const energiaEletricaLine = lines.find(l => l.includes('Energia ElétricakWh'));
  if (!energiaEletricaLine) throw new Error('Energia Elétrica não encontrada');
  const matchEletrica = energiaEletricaLine.match(/kWh\s+([\d.]+)\s+[\d.,]+\s+([\d.,]+)/);
  if (!matchEletrica) throw new Error(`Erro ao extrair Energia Elétrica. Linha: "${energiaEletricaLine}"`);
  const energiaEletricaKwh = parseFloat(normalize(matchEletrica[1]));
  const energiaEletricaReais = parseFloat(normalize(matchEletrica[2]));

  // Energia SCEE
  const energiaSCEEline = lines.find(l => l.includes('Energia SCEE s/ ICMSkWh'));
  if (!energiaSCEEline) throw new Error('Energia SCEE não encontrada');
  const matchSCEE = energiaSCEEline.match(/kWh\s+([\d.]+)\s+[\d.,]+\s+([\d.,]+)/);
  if (!matchSCEE) throw new Error(`Erro ao extrair dados de Energia SCEE. Linha: "${energiaSCEEline}"`);
  const energiaSCEEEKwh = parseFloat(normalize(matchSCEE[1]));
  const energiaSCEEReais = parseFloat(normalize(matchSCEE[2]));

  // Energia GD (Compensada)
  const energiaGDline = lines.find(l => l.includes('Energia compensada GD IkWh'));
  if (!energiaGDline) throw new Error('Energia GD não encontrada');
  const matchGD = energiaGDline.match(/kWh\s+([\d.]+)\s+[\d.,]+\s+(-?[\d.,]+)/);
  if (!matchGD) throw new Error(`Erro ao extrair Energia GD. Linha: "${energiaGDline}"`);
  const energiaCompensadaKwh = parseFloat(normalize(matchGD[1]));
  const energiaCompensadaReais = parseFloat(normalize(matchGD[2]));

  // Contribuição Iluminação Pública
  const contribLine = lines.find(l => l.includes('Contrib Ilum Publica Municipal'));
  if (!contribLine) throw new Error('Contribuição de Iluminação Pública não encontrada');
  const matchIlum = contribLine.match(/([\d.,]+)$/);
  if (!matchIlum) throw new Error(`Erro ao extrair valor da contribuição. Linha: "${contribLine}"`);
  const contribuicaoIlumReais = parseFloat(normalize(matchIlum[1]));

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
