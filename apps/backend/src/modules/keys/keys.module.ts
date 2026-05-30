import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from './api-key.entity';
import { KeysService } from './keys.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey])],
  providers: [KeysService],
  exports: [KeysService],
})
export class KeysModule {}
