import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { describe, beforeEach, it } from 'node:test';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller);
  });
});
function expect(controller: ProductsController) {
  throw new Error('Function not implemented.');
}

