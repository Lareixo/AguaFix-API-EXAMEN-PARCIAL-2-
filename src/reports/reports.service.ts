import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
import { CreateReportDto } from './dtos/create-report.dto';
import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';
import { envs } from '../config/envs';
import { generateReportTemplate } from './templates/report.template';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly emailService: EmailService,
    private readonly storageService: StorageService,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    photo: Express.Multer.File,
  ): Promise<Report> {
    const photoUrl = await this.storageService.uploadFile(photo, 'reports/');

    const report = await this.reportsRepository.create({
      ...createReportDto,
      photoUrl,
    });

    const template = generateReportTemplate(createReportDto, photoUrl);

    await this.emailService.sendEmail(
      envs.mailer.to,
      'Nuevo reporte de fuga de agua - AguaFix',
      template,
    );

    return report;
  }

  async findAll(): Promise<Report[]> {
    return this.reportsRepository.findAll();
  }
}