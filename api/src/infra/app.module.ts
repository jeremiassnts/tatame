import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvModule } from 'src/env/env.module';
import { envSchema } from 'src/env/env.schema';
import { AuthModule } from './auth/auth.module';
import { EnvService } from 'src/env/env.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ControllersModule } from 'src/controllers/controllers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    EnvModule,
    ControllersModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'public/reset-password'),
      serveRoot: '/reset-password',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'public/main'),
      serveRoot: '/',
    }),
  ],
  providers: [EnvService],
})
export class AppModule {}
