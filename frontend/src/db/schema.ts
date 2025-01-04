import { relations } from "drizzle-orm";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  username: text("username").notNull(),
  createdAt: timestamp().$defaultFn(() => new Date()),
  updatedAt: timestamp("updatedAt")
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  badges: many(gitbadges),
  accounts: many(accounts),
  authenticators: many(authenticators),
}));

export const gitbadges = pgTable("gitbadge", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  badgeId: text("badge_id").notNull(),
  createdAt: timestamp().$defaultFn(() => new Date()),
  updatedAt: timestamp("updatedAt")
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export const gitbadgesRelations = relations(gitbadges, ({ one }) => ({
  users: one(users, {
    fields: [gitbadges.userId],
    references: [users.id],
  }),
}));

// -------------------------------------------------------------

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    createdAt: timestamp().$defaultFn(() => new Date()),
    updatedAt: timestamp("updatedAt")
      .$default(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  users: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
    createdAt: timestamp().$defaultFn(() => new Date()),
    updatedAt: timestamp("updatedAt")
      .$default(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);

export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
  users: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}));
