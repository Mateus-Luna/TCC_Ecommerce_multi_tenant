import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './stores.service';
import { describe, beforeEach, it } from 'node:test';

describe('StoreService', () => {
  let service: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(service);
  });
});
function expect(service: StoreService) {
  throw new Error('Function not implemented.');
}

