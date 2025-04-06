import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { InvoicesService } from './service/invoices.service';
import { extname } from 'path';
import { Body } from '@nestjs/common';
import { UploadInvoiceBase64Dto } from './dto/upload-base64.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) { }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = `${Date.now()}${extname(file.originalname)}`;
          cb(null, randomName);
        },
      }),
    }),
  )
  
  async uploadInvoice(@UploadedFile() file: Express.Multer.File) {
    const saved = await this.invoicesService.parseAndSaveInvoice(file.path);
    return { message: 'Fatura salva com sucesso!', data: saved };
  }

  @Get('summary')
  async getSummary(
    @Query('client') client: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.invoicesService.getSummary(client, start, end);
  }

  @Get()
  async findAll() {
    return this.invoicesService.findAll();
  }

  @Get('filter')
  async filterByClientAndPeriod(
    @Query('client') client: string,
    @Query('rangeStart') rangeStart: string,
    @Query('rangeEnd') rangeEnd: string,
  ) {
    return this.invoicesService.filterInvoices(client, rangeStart, rangeEnd);
  }

  @Post('upload-base64')
  async uploadInvoiceFromBase64(
    @Body() dto: UploadInvoiceBase64Dto,
  ) {
    return this.invoicesService.uploadBase64AndSave(dto);
  }
}
