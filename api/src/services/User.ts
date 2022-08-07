import { PrismaClient } from "@prisma/client";

class User {
  public db: PrismaClient;

  constructor() {
    const prisma = new PrismaClient();
    this.db = prisma;
  }

  getUsers() {
    return this.db.user.findMany();
  }

  getUser({ userId, email }: { userId?: number; email?: string }) {
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
