import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CasosCovidModule } from './casos-covid/casos-covid.module';
import { EstadoModule } from './estado/estado.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PerfilModule } from './perfil/perfil.module';
import { PermissionModule } from './permission/permission.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CasosConsolidadosModule } from './casos-consolidados/casos-consolidados.module';
import "reflect-metadata";

require('dotenv').config();

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true
  }),
  TypeOrmModule.forRoot({
    applicationName: process.env.APPLICATION_NAME,
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(<string>process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrationsRun: Boolean(process.env.RUN_MIGRATIONS),
    migrationsTableName: 'migration',
    migrations: ["dist/config/migrations/**/*.js"],
    ssl: false,
    synchronize: Boolean(process.env.SYNCHRONIZE),
    autoLoadEntities: true,
    namingStrategy: new SnakeNamingStrategy()
  }),
  AuthModule,
  CasosCovidModule,
  EstadoModule,
  UsuarioModule,
  PerfilModule,
  PermissionModule,
  CasosConsolidadosModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {}
