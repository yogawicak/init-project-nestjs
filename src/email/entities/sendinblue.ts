export interface SendInBlueDataSender {
  sender: EmailSender;
  to: [EmailReceiver];
  subject: string;
  htmlContent: string;
}

interface Email {
  name?: string;
  email: string;
}

export interface SendInBlueResponse {
  messageId: string;
}

export type EmailSender = Email;
export type EmailReceiver = Email;
