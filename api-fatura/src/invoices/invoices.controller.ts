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
import { StreamableFile } from '@nestjs/common';
import { Param, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

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
    const saved = await this.invoicesService.parseAndSaveInvoice(file.path, file.filename);
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

  @Get('dash')
  async findDash() {
    return this.invoicesService.findDash();
  }

  @Get('findMonth')
  async findMonth() {
    return this.invoicesService.findMonth();
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

  @Get('download/:filename')
  async downloadInvoice(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    try {
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      });

      return await this.invoicesService.getInvoiceFileStream(filename);
    } catch (err) {
      throw new HttpException('Arquivo não encontrado', HttpStatus.NOT_FOUND);
    }
  }

}
