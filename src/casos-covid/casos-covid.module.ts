import { Module } from '@nestjs/common';
import { CasosCovidService } from './service/casos-covid.service';
import { CasosCovidController } from './controller/casos-covid.controller';
import { CasosCovid } from './entities/casos-covid.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([CasosCovid])
  ],
  controllers: [CasosCovidController],
  providers: [CasosCovidService]
})
export class CasosCovidModule {}
