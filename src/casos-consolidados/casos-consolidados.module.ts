import { Module } from '@nestjs/common';
import { CasosConsolidadosService } from './service/casos-consolidados.service';
import { CasosConsolidadosController } from './controller/casos-consolidados.controller';

@Module({
  controllers: [CasosConsolidadosController],
  providers: [CasosConsolidadosService]
})
export class CasosConsolidadosModule {}
