import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from '../entities/invoice.entity';
import { Any, Repository } from 'typeorm';
import { parseInvoicePDF} from '../invoice.parser';
import * as fs from 'fs';
import * as path from 'path';
import { UploadInvoiceBase64Dto } from '../dto/upload-base64.dto';
import { InvoiceData } from '../interface/invoice.types';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async parseAndSaveInvoice(filePath: string, filename: string): Promise<Invoice> {
    const data: InvoiceData = await parseInvoicePDF(filePath);
  
    const invoice = this.invoiceRepository.create({
      clientNumber: data.clientNumber,
      referenceMonth: data.referenceMonth,
      energiaEletricaKwh: data.energiaEletricaKwh,
      energiaEletricaReais: data.energiaEletricaReais,
      energiaSCEEEKwh: data.energiaSCEEEKwh,
      energiaSCEEReais: data.energiaSCEEReais,
      energiaCompensadaKwh: data.energiaCompensadaKwh,
      energiaCompensadaReais: data.energiaCompensadaReais,
      contribuicaoIlumReais: data.contribuicaoIlumReais,
      filename: filename, // 💾 salva o nome do arquivo no banco
    });
  
    return this.invoiceRepository.save(invoice);
  }
  

  async getSummary(clientNumber?: string, start?: string, end?: string) {
    const query = this.invoiceRepository.createQueryBuilder('invoice');

    if (clientNumber) query.andWhere('invoice.clientNumber = :clientNumber', { clientNumber });
    if (start) query.andWhere('invoice.referenceMonth >= :start', { start });
    if (end) query.andWhere('invoice.referenceMonth <= :end', { end });

    const invoices = await query.getMany();

    const totalEnergia = invoices.reduce((sum, i) => sum + i.energiaEletricaKwh + i.energiaSCEEEKwh, 0);
    const totalCompensada = invoices.reduce((sum, i) => sum + i.energiaCompensadaKwh, 0);
    const totalSemGD = invoices.reduce((sum, i) =>
      sum + i.energiaEletricaReais + i.energiaSCEEReais + i.contribuicaoIlumReais, 0);
    const totalEconomia = invoices.reduce((sum, i) => sum + i.energiaCompensadaReais, 0);

    return {
      totalEnergiaConsumidaKwh: totalEnergia,
      totalEnergiaCompensadaKwh: totalCompensada,
      valorTotalSemGD: totalSemGD,
      economiaComGD: totalEconomia,
    };
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find();
  }

  async findDash(): Promise<any> {
    const data = await this.invoiceRepository.find();
  
    const totalEnergiaEletricaKwh = data.reduce((acc, invoice) => {
      return acc + Number(invoice.energiaEletricaKwh);
    }, 0);
  
    const totalEnergiaCompensadaKwh = data.reduce((acc, invoice) => {
      return acc + Number(invoice.energiaCompensadaKwh);
    }, 0);
  
    const valorTotalSemGDRReais = data.reduce((acc, invoice) => {
      return (
        acc +
        Number(invoice.energiaEletricaReais) +
        Number(invoice.energiaSCEEReais)
      );
    }, 0);
  
    const economiaGDRReais = data.reduce((acc, invoice) => {
      return acc + Math.abs(Number(invoice.energiaCompensadaReais));
    }, 0);
    
    return {
      totalConsumption: totalEnergiaEletricaKwh,
      totalCompensated: totalEnergiaCompensadaKwh,
      totalValueWithoutGD: Number(valorTotalSemGDRReais.toFixed(2)),
      totalGDSavings: Number(economiaGDRReais.toFixed(2)),
    };
  }
  
  async findMonth(): Promise<any> {
    const datas = await this.invoiceRepository.find();
  
    const monthMap = {
      '01': 'Jan',
      '02': 'Fev',
      '03': 'Mar',
      '04': 'Abr',
      '05': 'Mai',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Ago',
      '09': 'Set',
      '10': 'Out',
      '11': 'Nov',
      '12': 'Dez',
    };
  
    const grouped: Record<string, { consumption: number; compensated: number }> = {};
  
    datas.forEach((data) => {
      const [month, year] = data.referenceMonth.split('/');
      const monthAbbr = monthMap[month];
  
      if (!grouped[monthAbbr]) {
        grouped[monthAbbr] = {
          consumption: 0,
          compensated: 0,
        };
      }
  
      grouped[monthAbbr].consumption += Number(data.energiaEletricaKwh) || 0;
      grouped[monthAbbr].compensated += Number(data.energiaCompensadaKwh) || 0;      
    });
  
    const dados = Object.entries(grouped).map(([month, values]) => ({
      month,
      consumption: values.consumption,
      compensated: values.compensated,
    }));
  
    return dados;
  }
  

  async findByClient(clientNumber: string): Promise<Invoice[]> {
    return this.invoiceRepository.find({ where: { clientNumber } });
  }

  async filterInvoices(clientNumber?: string, start?: string, end?: string): Promise<Invoice[]> {
    const query = this.invoiceRepository.createQueryBuilder('invoice');
  
    if (clientNumber) {
      query.andWhere('invoice.clientNumber = :clientNumber', { clientNumber });
    }
  
    if (start) {
      query.andWhere('invoice.referenceMonth >= :start', { start });
    }
  
    if (end) {
      query.andWhere('invoice.referenceMonth <= :end', { end });
    }
  
    query.orderBy('invoice.referenceMonth', 'ASC');
  
    return query.getMany();
  } 
  
  async uploadBase64AndSave(data: UploadInvoiceBase64Dto): Promise<Invoice> {
    const uploadsDir = path.resolve('./upload');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  
    const generatedFilename = `${Date.now()}_${data.filename}`;
    const filePath = path.join(uploadsDir, generatedFilename);
    const base64Cleaned = data.base64.replace(/^data:.*;base64,/, '');
    const fileBuffer = Buffer.from(base64Cleaned, 'base64');
    
    fs.writeFileSync(filePath, fileBuffer);
  
    const invoice = await this.parseAndSaveInvoice(filePath, generatedFilename);
    return invoice;
  }
  
  async getInvoiceFileStream(filename: string): Promise<StreamableFile> {
    const filePath = path.resolve('./upload', filename);
    console.log('Path download',filePath);
    if (!fs.existsSync(filePath)) {
      throw new Error('Arquivo não encontrado');
    }
  
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }
  
}
