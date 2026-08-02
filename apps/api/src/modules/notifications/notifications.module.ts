import { Module } from '@nestjs/common';
import { WhatsappSenderProcessor } from './senders/whatsapp-sender.processor';

@Module({
  providers: [WhatsappSenderProcessor],
})
export class NotificationsModule {}
