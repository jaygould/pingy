import { PrismaClient, User as UserType } from "@prisma/client";
import { PickRename } from "../ts-types";

class User {
  public db: PrismaClient;

  constructor() {
    const prisma = new PrismaClient();
    this.db = prisma;
  }

  getUsers() {
    return this.db.user.findMany();
  }

  getUser({
    userId,
    email,
  }: Partial<Pick<UserType, "email"> & PickRename<UserType, "id", "userId">>) {
    if (userId) {
      return this.db.user.findUnique({
        where: {
          id: userId,
        },
      });
    }
    if (email) {
      return this.db.user.findUnique({
        where: {
          email: email,
        },
      });
    }
    return null;
  }
}

export { User };
