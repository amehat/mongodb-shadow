import { Test, TestingModule } from '@nestjs/testing';

import AppModule from '../app.module';
import MikroOrmModule from '../../../src/mikro-orm/mikro-orm.module';

describe('Mikro-orm', () => {
    beforeEach(async () => {
        const module:TestingModule = await Test.createTestingModule({
            imports: [AppModule, MikroOrmModule],
        }).compile();
    });

    it('should get Hello Word', () => {
        expect(true).toBe(true);
    });
});
