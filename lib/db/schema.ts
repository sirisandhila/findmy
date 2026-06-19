import {
  pgTable,
  integer,
  text,
  real,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const colleges = pgTable("colleges", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  image: text("image").notNull(),
  rating: real("rating").notNull(),
  reviews: integer("reviews").notNull(),
  fees: integer("fees").notNull(),
  feesLabel: text("fees_label").notNull(),
  stream: text("stream").notNull(),
  type: text("type").notNull(),
  ranking: integer("ranking").notNull(),
  rankingBody: text("ranking_body").notNull(),
  courses: integer("courses").notNull(),
  accredited: text("accredited").notNull(),
  exams: text("exams").array().notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export type CollegeRow = typeof colleges.$inferSelect
