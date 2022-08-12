import { PrismaClient, PageCrawl } from "@prisma/client";
import { AlertEmail } from "./AlertEmail";

type AlertMethods = "TEXT" | "EMAIL";
type AlertType = "CONTENT_CHANGED" | "SITE_DOWN";

type TAlertConstructor = {
  alertMethods: Array<AlertMethods>;
  alertType: AlertType;
} & Pick<PageCrawl, "userId" | "pageUrl">;

class Alert {
  public db: PrismaClient;
  public alertMethods;
  public alertType;
  public userId;
  public pageUrl;

  constructor({ alertMethods, alertType, userId, pageUrl }: TAlertConstructor) {
    this.db = new PrismaClient();
    this.alertMethods = alertMethods;
    this.alertType = alertType;
    this.userId = userId;
    this.pageUrl = pageUrl;

    if (!this.alertMethods || !this.alertType || !this.userId || !this.pageUrl)
      throw new Error("Missing constructor arguments");
  }

  async sendAlert(): Promise<void> {
    const alertMessage = this.constructAlertMessage();

    if (!alertMessage) throw new Error("No matching message to send.");

    if (this.alertMethods.includes("EMAIL")) {
      const alert = new AlertEmail({ alertMessage, userId: this.userId });
      return alert.sendEmail();
    }
    if (this.alertMethods.includes("TEXT")) {
      // TODO: create and implement text messaging
    }

    return;
  }

  async getSentAlerts() {
    // TODO: get previously sent alerts
  }

  private constructAlertMessage(): string | undefined {
    let alertMessage;

    if (this.alertType === "CONTENT_CHANGED") {
      alertMessage = `The content for the website ${this.pageUrl} has changed!`;
    }
    if (this.alertType === "SITE_DOWN") {
      alertMessage = `The site ${this.pageUrl} is down!`;
    }

    return alertMessage;
  }
}

export { Alert };
