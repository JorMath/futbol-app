import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TeamsModule } from './modules/teams/teams.module';
import { ChatModule } from './modules/chat/chat.module';
import { PlayersModule } from './modules/players.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
      serveStaticOptions: {
        index: 'index.html',
        fallthrough: false,
      },
    }),
    AuthModule, 
    TeamsModule, 
    ChatModule, 
    PlayersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
