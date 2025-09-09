import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

const prisma = new PrismaClient();

async function main() {
  // ====== User Seed ======
  const email = "loonhtet.dev@gmail.com";
  const existingUser = await prisma.users.findUnique({ where: { email } });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("root", 10);
    await prisma.users.create({
      data: {
        id: uuidv4(),
        name: "Loon Htet",
        email,
        password: hashedPassword,
        email_verified: true,
        verification_token: "verify-token",
        verification_expires: new Date(Date.now() + 86400000), // 1 day
      },
    });
    console.log("🌲 User created");
  } else {
    console.log("🌲 User already exists");
  }

  // ====== Bookings Seed ======
  const bookingsData = [
    {
      id: uuidv4(),
      full_name: "Alice Johnson",
      email_address: "alice@example.com",
      phone_number: "0912345678",
      service: "Website Development",
      note: "Please contact after 5 PM",
    },
    {
      id: uuidv4(),
      full_name: "Bob Smith",
      email_address: "bob@example.com",
      phone_number: "0987654321",
      service: "Mobile App Design",
      note: "Urgent project",
    },
    {
      id: uuidv4(),
      full_name: "Charlie Brown",
      email_address: "charlie@example.com",
      phone_number: "0901122334",
      service: "SEO Optimization",
      note: null,
    },
  ];

  for (const booking of bookingsData) {
    await prisma.bookings.create({ data: booking });
  }
  console.log("🌲 Bookings seed completed");

  // ====== Categories Seed ======
  const categoriesData = [
    { name: "Technology" },
    { name: "Design" },
    { name: "Business" },
    { name: "Lifestyle" },
  ];

  const categories = [];
  for (const category of categoriesData) {
    const slug = slugify(category.name, { lower: true });
    const created = await prisma.categories.upsert({
      where: { slug }, // unique field
      update: {},
      create: {
        id: uuidv4(),
        name: category.name,
        slug,
      },
    });
    categories.push(created);
  }
  console.log("🌲 Categories seed completed");

  // ====== Blogs Seed ======
  const blogsData = [
    {
      title: "The Future of Web Development",
      content: `
  # The Future of Web Development
  Web development is evolving rapidly with frameworks like **Next.js**, **Remix**, and modern tooling...
      `,
      description:
        "An in-depth look at the upcoming trends and technologies shaping the future of web development.",
      thumbnail: "https://example.com/thumbnails/webdev.png",
      published: true,
      category: "technology",
    },
    {
      title: "10 Design Tips for Better UI/UX",
      content: `
  # 10 Design Tips for Better UI/UX
  Good design is more than just aesthetics.
  Here are **10 actionable tips** you can use in your next project...
      `,
      description:
        "Learn practical tips and tricks to enhance user interface and experience in your design projects.",
      thumbnail: "https://example.com/thumbnails/design.png",
      published: true,
      category: "design",
    },
    {
      title: "How to Scale Your Startup",
      content: `
  # How to Scale Your Startup
  Scaling a startup requires the right **mindset**, **funding strategy**, and **team building**...
      `,
      description:
        "Key strategies for startup founders on how to grow their business efficiently and sustainably.",
      thumbnail: "https://example.com/thumbnails/startup.png",
      published: false,
      category: "business",
    },
  ];

  for (const blog of blogsData) {
    const slug = slugify(blog.title, { lower: true });
    const category = categories.find(
      (c) => c.slug === blog.category.toLowerCase(),
    );

    await prisma.blogs.upsert({
      where: { slug },
      update: {},
      create: {
        id: uuidv4(),
        title: blog.title,
        slug,
        description: blog.description,
        content: blog.content,
        thumbnail: blog.thumbnail,
        published: blog.published,
        categoryId: category?.id,
      },
    });
  }
  console.log("🌲 Blogs seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
