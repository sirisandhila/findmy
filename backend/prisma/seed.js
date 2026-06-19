const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Data ported 1:1 from the frontend's lib/colleges.ts, enriched with the
// extra fields from the original product spec (placement %, packages, etc.)
const colleges = [
  {
    name: "Indian Institute of Technology Delhi",
    shortName: "IIT Delhi",
    location: "Hauz Khas, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    image: "/campus-1.png",
    rating: 4.8,
    reviewCount: 1240,
    fees: 850000,
    feesLabel: "₹8.5L total",
    stream: "Engineering",
    type: "GOVERNMENT",
    ranking: 2,
    rankingBody: "NIRF 2025",
    courseCount: 64,
    accredited: "NAAC A++",
    exams: ["JEE Advanced", "GATE"],
    featured: true,
    placementPercentage: 96,
    averagePackage: 2100000,
    highestPackage: 18000000,
    establishedYear: 1961,
    website: "https://home.iitd.ac.in",
  },
  {
    name: "St. Xavier's College",
    shortName: "St. Xavier's",
    location: "Park Street, Kolkata",
    city: "Kolkata",
    state: "West Bengal",
    image: "/campus-2.png",
    rating: 4.5,
    reviewCount: 870,
    fees: 210000,
    feesLabel: "₹2.1L total",
    stream: "Arts & Science",
    type: "PRIVATE",
    ranking: 9,
    rankingBody: "NIRF 2025",
    courseCount: 38,
    accredited: "NAAC A+",
    exams: ["CUET"],
    placementPercentage: 78,
    averagePackage: 600000,
    highestPackage: 2400000,
    establishedYear: 1860,
    website: "https://www.sxccal.edu",
  },
  {
    name: "Christ University",
    shortName: "Christ University",
    location: "Hosur Road, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    image: "/campus-3.png",
    rating: 4.4,
    reviewCount: 2100,
    fees: 320000,
    feesLabel: "₹3.2L total",
    stream: "Management",
    type: "DEEMED",
    ranking: 24,
    rankingBody: "NIRF 2025",
    courseCount: 92,
    accredited: "NAAC A+",
    exams: ["CUET", "Christ Entrance"],
    featured: true,
    placementPercentage: 85,
    averagePackage: 750000,
    highestPackage: 3200000,
    establishedYear: 1969,
    website: "https://christuniversity.in",
  },
  {
    name: "Vellore Institute of Technology",
    shortName: "VIT Vellore",
    location: "Katpadi, Vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    image: "/campus-4.png",
    rating: 4.3,
    reviewCount: 3400,
    fees: 780000,
    feesLabel: "₹7.8L total",
    stream: "Engineering",
    type: "DEEMED",
    ranking: 11,
    rankingBody: "NIRF 2025",
    courseCount: 71,
    accredited: "NAAC A++",
    exams: ["VITEEE"],
    placementPercentage: 90,
    averagePackage: 850000,
    highestPackage: 4100000,
    establishedYear: 1984,
    website: "https://vit.ac.in",
  },
  {
    name: "All India Institute of Medical Sciences",
    shortName: "AIIMS Delhi",
    location: "Ansari Nagar, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    image: "/campus-1.png",
    rating: 4.9,
    reviewCount: 1560,
    fees: 130000,
    feesLabel: "₹1.3L total",
    stream: "Medical",
    type: "GOVERNMENT",
    ranking: 1,
    rankingBody: "NIRF 2025",
    courseCount: 45,
    accredited: "NAAC A++",
    exams: ["NEET UG", "NEET PG"],
    placementPercentage: 99,
    averagePackage: 1200000,
    highestPackage: 3500000,
    establishedYear: 1956,
    website: "https://www.aiims.edu",
  },
  {
    name: "National Law School of India University",
    shortName: "NLSIU Bangalore",
    location: "Nagarbhavi, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    image: "/campus-2.png",
    rating: 4.7,
    reviewCount: 640,
    fees: 1290000,
    feesLabel: "₹12.9L total",
    stream: "Law",
    type: "GOVERNMENT",
    ranking: 1,
    rankingBody: "NIRF Law 2025",
    courseCount: 12,
    accredited: "NAAC A",
    exams: ["CLAT"],
    placementPercentage: 94,
    averagePackage: 1800000,
    highestPackage: 5000000,
    establishedYear: 1987,
    website: "https://www.nls.ac.in",
  },
  {
    name: "Symbiosis Institute of Business Management",
    shortName: "SIBM Pune",
    location: "Lavale, Pune",
    city: "Pune",
    state: "Maharashtra",
    image: "/campus-3.png",
    rating: 4.4,
    reviewCount: 980,
    fees: 2300000,
    feesLabel: "₹23L total",
    stream: "Management",
    type: "PRIVATE",
    ranking: 7,
    rankingBody: "NIRF Mgmt 2025",
    courseCount: 18,
    accredited: "NAAC A+",
    exams: ["SNAP"],
    placementPercentage: 92,
    averagePackage: 1400000,
    highestPackage: 4500000,
    establishedYear: 1992,
    website: "https://www.sibm.edu.in",
  },
  {
    name: "Banaras Hindu University",
    shortName: "BHU Varanasi",
    location: "Varanasi",
    city: "Varanasi",
    state: "Uttar Pradesh",
    image: "/campus-4.png",
    rating: 4.2,
    reviewCount: 2750,
    fees: 95000,
    feesLabel: "₹95K total",
    stream: "Arts & Science",
    type: "GOVERNMENT",
    ranking: 5,
    rankingBody: "NIRF 2025",
    courseCount: 140,
    accredited: "NAAC A+",
    exams: ["CUET"],
    placementPercentage: 70,
    averagePackage: 500000,
    highestPackage: 1800000,
    establishedYear: 1916,
    website: "https://www.bhu.ac.in",
  },
  {
    name: "Narsee Monjee College of Commerce",
    shortName: "NM College",
    location: "Vile Parle, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    image: "/campus-2.png",
    rating: 4.3,
    reviewCount: 1120,
    fees: 180000,
    feesLabel: "₹1.8L total",
    stream: "Commerce",
    type: "PRIVATE",
    ranking: 14,
    rankingBody: "NIRF 2025",
    courseCount: 26,
    accredited: "NAAC A",
    exams: ["NPAT", "CUET"],
    placementPercentage: 80,
    averagePackage: 620000,
    highestPackage: 2000000,
    establishedYear: 1964,
    website: "https://www.nmcollege.in",
  },
  {
    name: "Manipal Institute of Technology",
    shortName: "MIT Manipal",
    location: "Manipal, Udupi",
    city: "Manipal",
    state: "Karnataka",
    image: "/campus-1.png",
    rating: 4.2,
    reviewCount: 2980,
    fees: 1640000,
    feesLabel: "₹16.4L total",
    stream: "Engineering",
    type: "DEEMED",
    ranking: 45,
    rankingBody: "NIRF 2025",
    courseCount: 58,
    accredited: "NAAC A++",
    exams: ["MET"],
    placementPercentage: 88,
    averagePackage: 800000,
    highestPackage: 4000000,
    establishedYear: 1957,
    website: "https://manipal.edu",
  },
  {
    name: "Lady Shri Ram College for Women",
    shortName: "LSR Delhi",
    location: "Lajpat Nagar, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    image: "/campus-3.png",
    rating: 4.6,
    reviewCount: 760,
    fees: 110000,
    feesLabel: "₹1.1L total",
    stream: "Arts & Science",
    type: "GOVERNMENT",
    ranking: 3,
    rankingBody: "NIRF 2025",
    courseCount: 22,
    accredited: "NAAC A+",
    exams: ["CUET"],
    placementPercentage: 75,
    averagePackage: 550000,
    highestPackage: 1600000,
    establishedYear: 1956,
    website: "https://lsr.edu.in",
  },
  {
    name: "Loyola College",
    shortName: "Loyola Chennai",
    location: "Nungambakkam, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    image: "/campus-4.png",
    rating: 4.4,
    reviewCount: 1340,
    fees: 140000,
    feesLabel: "₹1.4L total",
    stream: "Commerce",
    type: "PRIVATE",
    ranking: 8,
    rankingBody: "NIRF 2025",
    courseCount: 34,
    accredited: "NAAC A++",
    exams: ["CUET"],
    placementPercentage: 82,
    averagePackage: 580000,
    highestPackage: 1900000,
    establishedYear: 1925,
    website: "https://www.loyolacollege.edu",
  },
];

const examsData = [
  { name: "JEE Advanced", description: "Entrance exam for IITs" },
  { name: "GATE", description: "Graduate Aptitude Test in Engineering" },
  { name: "CUET", description: "Common University Entrance Test" },
  { name: "Christ Entrance", description: "Christ University entrance exam" },
  { name: "VITEEE", description: "VIT Engineering Entrance Exam" },
  { name: "NEET UG", description: "National Eligibility cum Entrance Test (UG)" },
  { name: "NEET PG", description: "National Eligibility cum Entrance Test (PG)" },
  { name: "CLAT", description: "Common Law Admission Test" },
  { name: "SNAP", description: "Symbiosis National Aptitude Test" },
  { name: "NPAT", description: "NMIMS Programs After Twelfth" },
  { name: "MET", description: "Manipal Entrance Test" },
];

async function main() {
  console.log("Seeding database...");

  // Admin + sample student
  const adminPassword = await bcrypt.hash("Admin@12345", 12);
  const studentPassword = await bcrypt.hash("Student@12345", 12);

  await prisma.user.upsert({
    where: { email: "admin@collegekampus.com" },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@collegekampus.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@collegekampus.com" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@collegekampus.com",
      password: studentPassword,
      role: "STUDENT",
    },
  });

  // Exams
  const examRecords = {};
  for (const e of examsData) {
    const exam = await prisma.exam.upsert({
      where: { name: e.name },
      update: {},
      create: { ...e, slug: slugify(e.name) },
    });
    examRecords[e.name] = exam;
  }

  // Colleges
  for (const c of colleges) {
    const slug = slugify(c.shortName || c.name);
    const college = await prisma.college.upsert({
      where: { slug },
      update: {},
      create: {
        ...c,
        slug,
        images: [c.image],
        description: `${c.name} is a ${c.type.toLowerCase()} institution located in ${c.location}, offering top-ranked programs in ${c.stream}.`,
      },
    });

    // Link exams
    for (const examName of c.exams) {
      const exam = examRecords[examName];
      if (exam) {
        await prisma.collegeExam.upsert({
          where: { collegeId_examId: { collegeId: college.id, examId: exam.id } },
          update: {},
          create: { collegeId: college.id, examId: exam.id },
        });
      }
    }

    // Sample courses
    await prisma.course.createMany({
      data: [
        {
          collegeId: college.id,
          name: `B.Tech/Bachelor's in ${c.stream}`,
          duration: "4 Years",
          fees: c.fees,
          eligibility: `10+2 with relevant subjects, ${c.exams[0]} qualifying score`,
          seats: 120,
          stream: c.stream,
        },
        {
          collegeId: college.id,
          name: `Master's in ${c.stream}`,
          duration: "2 Years",
          fees: Math.round(c.fees * 0.6),
          eligibility: `Bachelor's degree in relevant field`,
          seats: 60,
          stream: c.stream,
        },
      ],
      skipDuplicates: true,
    });
  }

  // Sample saved college + review + application for the demo student
  const firstCollege = await prisma.college.findFirst({ orderBy: { ranking: "asc" } });
  if (firstCollege) {
    await prisma.savedCollege
      .upsert({
        where: { userId_collegeId: { userId: student.id, collegeId: firstCollege.id } },
        update: {},
        create: { userId: student.id, collegeId: firstCollege.id },
      })
      .catch(() => {});

    await prisma.review
      .upsert({
        where: { userId_collegeId: { userId: student.id, collegeId: firstCollege.id } },
        update: {},
        create: {
          userId: student.id,
          collegeId: firstCollege.id,
          rating: 5,
          comment: "Excellent faculty and infrastructure. Highly recommended!",
        },
      })
      .catch(() => {});

    await prisma.application
      .create({
        data: { userId: student.id, collegeId: firstCollege.id, status: "UNDER_REVIEW" },
      })
      .catch(() => {});
  }

  console.log("Seeding complete.");
  console.log("Admin login: admin@collegekampus.com / Admin@12345");
  console.log("Student login: student@collegekampus.com / Student@12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
