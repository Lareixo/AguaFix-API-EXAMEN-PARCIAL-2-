import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw BadRequestException when photo is missing on create', async () => {
    const dto: CreateReportDto = {
      address: 'Calle 123',
      description: 'Fuga fuerte',
      severity: 'high',
      reporterPhone: '1234567890',
    };

    await expect(controller.create(dto, undefined as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should call reportsService.create when photo is provided', async () => {
    const dto: CreateReportDto = {
      address: 'Calle 123',
      description: 'Fuga fuerte',
      severity: 'high',
      reporterPhone: '1234567890',
    };
    const mockFile = {
      buffer: Buffer.from('test-image'),
      originalname: 'fuga.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    const mockResult = { id: 1, ...dto, photoUrl: 'https://s3.com/fuga.jpg' };
    (service.create as jest.Mock).mockResolvedValue(mockResult);

    const result = await controller.create(dto, mockFile);

    expect(service.create).toHaveBeenCalledWith(dto, mockFile);
    expect(result).toEqual(mockResult);
  });

  it('should return all reports from reportsService.findAll', async () => {
    const mockReports = [
      {
        id: 1,
        address: 'Calle 1',
        photoUrl: 'https://s3/1.jpg',
        repairPhotoUrl: null,
      },
    ];
    (service.findAll as jest.Mock).mockResolvedValue(mockReports);

    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockReports);
  });
});
