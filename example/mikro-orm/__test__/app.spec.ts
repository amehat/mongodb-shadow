import { Test, TestingModule } from '@nestjs/testing';

import AppService from '../app.service';

describe('Mikro-orm', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('should get Hello Word', () => {
    expect(appService.getHello()).toBe('Hello World!');
  });
});
