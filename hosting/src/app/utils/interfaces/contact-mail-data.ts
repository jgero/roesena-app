export interface ContactMailData {
  subject: string;
  replyTo: string;
  formData: { [key: string]: string }[];
  comment: string;
}
