import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from './lib/auth';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
});

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.note.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const saltRounds = 10;
  const password1 = await hashPassword('password123', saltRounds);
  const password2 = await hashPassword('password123', saltRounds);
  const password3 = await hashPassword('password123', saltRounds);

  // Create users
  console.log('👤 Creating users...');
  const user1 = await prisma.user.create({
    data: {
      username: 'alice',
      password: password1,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'bob',
      password: password2,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: 'charlie',
      password: password3,
    },
  });

  console.log(
    `✅ Created users: ${user1.username}, ${user2.username}, ${user3.username}`
  );

  // Create notes for user1 (alice)
  console.log('📝 Creating notes...');
  const aliceNotes = await Promise.all([
    prisma.note.create({
      data: {
        userId: user1.id,
        title: 'Welcome to My Notes',
        content:
          'This is my first note. I can use this app to keep track of my thoughts and ideas.',
      },
    }),
    prisma.note.create({
      data: {
        userId: user1.id,
        title: 'Shopping List',
        content: 'Milk, Eggs, Bread, Cheese, Apples',
      },
    }),
    prisma.note.create({
      data: {
        userId: user1.id,
        title: 'Meeting Notes',
        content: 'Discuss project timeline and deliverables with the team.',
      },
    }),
    prisma.note.create({
      data: {
        userId: user1.id,
        title: 'Quick Reminder',
        content: null,
      },
    }),
  ]);

  // Create notes for user2 (bob)
  const bobNotes = await Promise.all([
    prisma.note.create({
      data: {
        userId: user2.id,
        title: 'Project Ideas',
        content: '1. Build a todo app\n2. Create a blog\n3. Learn TypeScript',
      },
    }),
    prisma.note.create({
      data: {
        userId: user2.id,
        title: 'Book Recommendations',
        content: 'Clean Code, The Pragmatic Programmer, Design Patterns',
      },
    }),
  ]);

  // Create notes for user3 (charlie)
  const charlieNotes = await Promise.all([
    prisma.note.create({
      data: {
        userId: user3.id,
        title: 'Daily Journal',
        content:
          'Today was a great day. I learned a lot about database seeding!',
      },
    }),
  ]);

  const totalNotes = aliceNotes.length + bobNotes.length + charlieNotes.length;
  console.log(`✅ Created ${totalNotes} notes across ${3} users`);

  console.log('🎉 Seed completed successfully!');
  console.log('\n📋 Test Users:');
  console.log('  - Username: alice, Password: password123');
  console.log('  - Username: bob, Password: password123');
  console.log('  - Username: charlie, Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
