// src/invoices/dto/upload-base64.dto.ts
import { IsString } from 'class-validator';

export class UploadInvoiceBase64Dto {
  @IsString()
  base64: string;

  @IsString()
  filename: string;
}
