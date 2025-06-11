import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TeamsModule } from './modules/teams/teams.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [AuthModule, TeamsModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
