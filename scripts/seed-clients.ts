import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = postgres(process.env.POSTGRES_URL!, { max: 1 });

const clients = [
  {
    name: "Camp Green Acres",
    location: "Markham, ON (Toronto)",
    campType: "Day Camp",
    stats: "1,339 campers · 60+ years · 540 texts · 1,019 logins · 16 users",
    description: "Two people from the same camp independently showed up to AI-focused CMC sessions. Adam Sandberg attended 4 sessions including Conversational Insights. Phil Faibish attended 3 sessions. Organizational buy-in, not one curious person dragging a colleague.",
    contacts: [
      { name: "Adam Sandberg", email: "adam@campgreenacres.com" },
      { name: "Phil Faibish", email: "phil@campgreenacres.com" },
    ],
  },
  {
    name: "Deer Kill Day Camp",
    location: "Suffern, NY",
    campType: "Day Camp",
    stats: "4,197 campers · $4.2M revenue · 29,920 texts · 6,482 logins · 18 users",
    description: "Texting stress test. Nearly 30,000 messages — already all-in on text-based parent communication. 3rd-generation family-owned since 1958. Family ownership means the people we talk to are the people who care most.",
    contacts: [
      { name: "Dennis", email: "dennis@deerkilldaycamp.com" },
      { name: "Todd Rothman", email: "directors@deerkilldaycamp.com" },
    ],
  },
  {
    name: "Tall Pines Day Camp",
    location: "Williamstown, NJ",
    campType: "Day Camp",
    stats: "7,880 campers · $4.1M revenue · 14,676 texts · 3,307 logins · 19 users",
    description: "Engagement culture pick. Four different people attended CMC sessions — Jamie Secula (3 sessions), Buffy Demain, Andrew, and Fun. When four people show up, that's how the organization operates. Family-owned since 1996 on 66 acres.",
    contacts: [
      { name: "Jamie Secula", email: "jamie@tallpinesdaycamp.com" },
      { name: "Buffy Demain", email: "buffy@tallpinesdaycamp.com" },
    ],
  },
  {
    name: "Fred's Camp",
    location: "San Clemente, CA",
    campType: "Day Camp",
    stats: "1,752 campers · $2.2M revenue · 4,400 texts · 891 logins · 9 users",
    description: "Intentional small-team pick. Only 9 users — if these tools can make a 9-person team punch above their weight, that's one of the most compelling proof points. SoCal day camp where every person wears multiple hats.",
    contacts: [
      { name: "Virgie Berry", email: "virgie@fredscamp.com" },
      { name: "Jodi", email: "jodi@fredscamp.com" },
    ],
  },
  {
    name: "Camps Equinunk & Blue Ridge",
    location: "Equinunk, PA",
    campType: "Sleepaway",
    stats: "Wayne County, PA — one of the densest camp regions in the country",
    description: "Sleepaway camp partner and CMC power engager. Jared Brown is a repeat CMC volunteer (3+ sessions). Anna visited the camp July 2025. Adding traditional sleepaway from Wayne County gives perspective our day-camp-heavy list was missing.",
    contacts: [
      { name: "Jared Brown", email: "jared@cecbr.com" },
    ],
  },
];

async function main() {
  for (const c of clients) {
    const existing = await sql`SELECT id FROM lh_clients WHERE name = ${c.name} LIMIT 1`;
    if (existing.length > 0) {
      console.log(`Already exists: ${c.name}`);
      continue;
    }
    await sql`
      INSERT INTO lh_clients (name, location, camp_type, stats, description, contacts)
      VALUES (${c.name}, ${c.location}, ${c.campType}, ${c.stats}, ${c.description}, ${JSON.stringify(c.contacts)}::jsonb)
    `;
    console.log(`Created: ${c.name}`);
  }
  await sql.end();
  console.log("Done!");
}

main().catch((e) => { console.error(e); process.exit(1); });
