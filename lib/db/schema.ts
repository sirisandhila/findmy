import {
  pgTable,
  integer,
  text,
  real,
  boolean,
  timestamp,
  numeric,
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

  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
})

export const collegeDetails = pgTable("college_details", {
  collegeId: integer("college_id")
    .primaryKey()
    .references(() => colleges.id),

  description: text("description"),

  establishedYear: integer("established_year"),

  campusSize: text("campus_size"),

  nirf2025: integer("nirf_2025"),
  nirf2024: integer("nirf_2024"),
  nirf2023: integer("nirf_2023"),

  coursesOffered: text("courses_offered").array(),

  eligibility: text("eligibility"),

  admissionProcess: text("admission_process"),

  placementRate: numeric("placement_rate"),

  averagePackage: numeric("average_package"),

  highestPackage: numeric("highest_package"),

  topRecruiters: text("top_recruiters").array(),

  hostelAvailable: boolean("hostel_available"),

  hostelFees: integer("hostel_fees"),

  website: text("website"),
})

export const collegeGallery = pgTable("college_gallery", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  collegeId: integer("college_id")
    .notNull()
    .references(() => colleges.id),

  imageUrl: text("image_url").notNull(),
})

export type CollegeRow = typeof colleges.$inferSelect

export type CollegeDetailsRow =
  typeof collegeDetails.$inferSelect

export type CollegeGalleryRow =
  typeof collegeGallery.$inferSelect
