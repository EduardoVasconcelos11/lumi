import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from '../entities/invoice.entity';
import { Repository } from 'typeorm';
import { parseInvoicePDF} from '../invoice.parser';
import * as fs from 'fs';
import * as path from 'path';
import { UploadInvoiceBase64Dto } from '../dto/upload-base64.dto';
import { InvoiceData } from '../interface/invoice.types';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async parseAndSaveInvoice(filePath: string): Promise<Invoice> {
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
    const uploadsDir = path.join(__dirname, '../../uploads');
    
    // 👇 Garante que o diretório existe
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  
    const filePath = path.join(uploadsDir, `${Date.now()}_${data.filename}`);
  
    const base64Cleaned = data.base64.replace(/^data:.*;base64,/, '');
    const fileBuffer = Buffer.from(base64Cleaned, 'base64');
  
    fs.writeFileSync(filePath, fileBuffer);
    const invoice = await this.parseAndSaveInvoice(filePath);
  
    fs.unlink(filePath, (err) => {
      if (err) console.error('Erro ao apagar arquivo temporário:', err);
    });
  
    return invoice;
  }
  
  
}
