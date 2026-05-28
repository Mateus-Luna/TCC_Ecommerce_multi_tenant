import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './stores.controller';
import { describe, beforeEach, it } from 'node:test';

describe('StoreController', () => {
  let controller: StoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
    }).compile();

    controller = module.get<StoreController>(StoreController);
  });

  it('should be defined', () => {
    expect(controller);
  });
});


function expect(controller: StoreController) {
  throw new Error('Function not implemented.');
}

