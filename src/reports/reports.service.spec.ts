import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { ReportsRepository } from './reports.repository';
import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';
import { CreateReportDto } from './dtos/create-report.dto';

describe('ReportsService', () => {
  let service: ReportsService;
  let repository: ReportsRepository;
  let emailService: EmailService;
  let storageService: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: ReportsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: StorageService,
          useValue: {
            uploadFile: jest
              .fn()
              .mockResolvedValue('https://my-bucket.s3.us-east-1.amazonaws.com/reports/fuga.jpg'),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    repository = module.get<ReportsRepository>(ReportsRepository);
    emailService = module.get<EmailService>(EmailService);
    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload photo to reports/ folder and save report with photoUrl and send email', async () => {
    const dto: CreateReportDto = {
      address: 'Av Principal 456',
      description: 'Fuga de agua en banqueta',
      severity: 'medium',
      reporterPhone: '4491112233',
    };
    const mockFile = {
      buffer: Buffer.from('img'),
      originalname: 'fuga.png',
      mimetype: 'image/png',
    } as Express.Multer.File;

    const mockSavedReport = {
      id: 1,
      ...dto,
      photoUrl: 'https://my-bucket.s3.us-east-1.amazonaws.com/reports/fuga.jpg',
      repairPhotoUrl: null,
      isResolved: false,
      createdAt: new Date(),
    };

    (repository.create as jest.Mock).mockResolvedValue(mockSavedReport);

    const result = await service.create(dto, mockFile);

    expect(storageService.uploadFile).toHaveBeenCalledWith(mockFile, 'reports/');
    expect(repository.create).toHaveBeenCalledWith({
      ...dto,
      photoUrl: 'https://my-bucket.s3.us-east-1.amazonaws.com/reports/fuga.jpg',
    });
    expect(emailService.sendEmail).toHaveBeenCalled();
    expect(result).toEqual(mockSavedReport);
  });

  it('should call repository.findAll on findAll', async () => {
    const mockReports = [
      {
        id: 1,
        address: 'Av 1',
        photoUrl: 'https://photo.jpg',
        repairPhotoUrl: null,
      },
    ];
    (repository.findAll as jest.Mock).mockResolvedValue(mockReports);

    const result = await service.findAll();
    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockReports);
  });
});
