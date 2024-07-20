import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmailDto } from './dtos/email.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @UsePipes(ValidationPipe)
  async sendEmail(@Body() body: EmailDto) {
    const hydratedHtml = this.emailService.hydrateTemplate(body);
    await this.emailService.sendEmail(hydratedHtml);

    return 'Email sent successfully';
  }
}
