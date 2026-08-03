import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";
import * as schema from "@/db/schema";

const appUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = db
  ? betterAuth({
      baseURL: appUrl,
      secret: process.env.BETTER_AUTH_SECRET,
      database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
          user: schema.user,
          session: schema.session,
          account: schema.account,
          verification: schema.verification,
        },
      }),
      emailAndPassword: {
        enabled: true,
      },
      socialProviders:
        googleClientId && googleClientSecret
          ? {
              google: {
                clientId: googleClientId,
                clientSecret: googleClientSecret,
              },
            }
          : undefined,
      user: {
        additionalFields: {
          role: {
            type: "string",
            defaultValue: "member",
            input: false,
          },
        },
      },
      trustedOrigins: [appUrl, process.env.NEXT_PUBLIC_APP_URL].filter(
        (origin): origin is string => Boolean(origin),
      ),
    })
  : null;

export type Session = NonNullable<typeof auth> extends { api: infer A }
  ? A extends { getSession: (...args: unknown[]) => Promise<infer S> }
    ? S
    : never
  : never;
