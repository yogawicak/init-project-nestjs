import { HttpService } from '@nestjs/axios';
import axios, { AxiosError } from 'axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  EmailReceiver,
  EmailSender,
  SendInBlueDataSender,
  SendInBlueResponse,
} from './entities/sendinblue';
import { Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private readonly logger = new Logger(EmailService.name);

  async sendEmailSendInBlue(
    sender: EmailSender,
    receiver: [EmailReceiver],
    subject: string,
    htmlContent: string,
  ) {
    try {
      const sending = await firstValueFrom(
        this.httpService.post<SendInBlueResponse>(
          this.configService.get<string>('URL_SENDINBLUE'),
          <SendInBlueDataSender>{
            sender,
            to: receiver,
            subject,
            htmlContent,
          },
          {
            headers: {
              'api-key': this.configService.get<string>('API_KEY_SENDINBLUE'),
              'content-type': 'application/json',
              accept: 'application/json',
            },
          },
        ),
      );
      this.logger.log(sending.data, 'Send Email using SendinBlue');
    } catch (err) {
      const error = err as Error | AxiosError;
      this.logger.error(err.response);
      if (axios.isAxiosError(error)) {
        throw new BadRequestException(error.response.data);
      } else {
        throw new BadRequestException(error);
      }
      // console.log(error instanceof AxiosError);
    }
  }
}
