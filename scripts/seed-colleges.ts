import { db } from "@/lib/db";
import { colleges } from "@/lib/db/schema";

const collegesData = [
  {
    id: 1,
    name: "IIT Hyderabad",
    shortName: "IITH",
    location: "Kandi, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    image: "/colleges/iith.jpg",
    rating: 4.8,
    reviews: 1200,
    fees: 250000,
    feesLabel: "Per Year",
    stream: "Engineering",
    type: "Government",
    ranking: 8,
    rankingBody: "NIRF",
    courses: 25,
    accredited: "NAAC A++",
    exams: ["JEE Advanced"],
    featured: true,
  },

  {
    id: 2,
    name: "IIT Bombay",
    shortName: "IITB",
    location: "Powai, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    image: "/colleges/iitb.jpg",
    rating: 4.9,
    reviews: 2200,
    fees: 230000,
    feesLabel: "Per Year",
    stream: "Engineering",
    type: "Government",
    ranking: 3,
    rankingBody: "NIRF",
    courses: 35,
    accredited: "NAAC A++",
    exams: ["JEE Advanced"],
    featured: true,
  },

  {
    id: 3,
    name: "IIT Delhi",
    shortName: "IITD",
    location: "Hauz Khas, Delhi",
    city: "Delhi",
    state: "Delhi",
    image: "/colleges/iitd.jpg",
    rating: 4.9,
    reviews: 2100,
    fees: 240000,
    feesLabel: "Per Year",
    stream: "Engineering",
    type: "Government",
    ranking: 2,
    rankingBody: "NIRF",
    courses: 30,
    accredited: "NAAC A++",
    exams: ["JEE Advanced"],
    featured: true,
  }
];

async function seed() {
  await db.insert(colleges).values(collegesData);
  console.log("Seed completed");
}

seed();
