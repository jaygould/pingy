import { PrismaClient } from "@prisma/client";
import { User } from "./User";
import * as Postmark from "postmark";
const POSTMARK_SECRET: string = process.env.POSTMARK_SECRET || "";

class AlertEmail {
  public db: PrismaClient;
  public alertMessage: string;
  public userId: number;
  public postmark: Postmark.ServerClient;
  public fromAddress: string;
  public subjectLine: string;

  constructor({
    alertMessage,
    userId,
  }: {
    alertMessage: string;
    userId: number;
  }) {
    this.db = new PrismaClient();
    this.postmark = new Postmark.ServerClient(POSTMARK_SECRET);
    this.alertMessage = alertMessage;
    this.userId = userId;
    this.fromAddress = "pingy@jaygould.co.uk";
    this.subjectLine = "New alert from Pingy";
  }

  async getUserEmailAddress(): Promise<string> {
    const user = await new User().getUser({ userId: this.userId });

    if (!user || !user.email) throw new Error("Missing user");

    return user.email;
  }

  async sendEmail(): Promise<void> {
    const userEmail = await this.getUserEmailAddress();

    try {
      await this.postmark.sendEmail({
        From: this.fromAddress,
        To: userEmail,
        Subject: this.subjectLine,
        HtmlBody: this.alertMessage,
        TextBody: this.alertMessage,
        MessageStream: "outbound",
      });

      return;
    } catch (e) {
      throw new Error("Email failed to send");
    }
  }
}

export { AlertEmail };
