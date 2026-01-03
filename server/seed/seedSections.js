const mongoose = require('mongoose');
require('dotenv').config();

const Department = require('../models/Department');
const Section = require('../models/Section');

const seedSections = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing sections
    await Section.deleteMany({});
    console.log('🗑️  Cleared existing sections');

    // Get all departments
    const departments = await Department.find();
    console.log(`📊 Found ${departments.length} departments`);

    const allSections = [];

    for (const department of departments) {
      console.log(`\n🏫 Creating sections for ${department.name}...`);

      // ============================================
      // 2ND YEAR: 12 SECTIONS (2A-2L)
      // ============================================
      const secondYearSections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
      for (const letter of secondYearSections) {
        const sectionCode = `2${letter}`;
        const section = {
          code: sectionCode,
          name: `${sectionCode} - 2nd Year`,
          department: department._id,
          academicYear: '2nd Year',
          year: 2,
          cycle: null,
          capacity: 60
        };
        allSections.push(section);
        console.log(`   ✅ Created: ${sectionCode} - 2nd Year`);
      }

      // ============================================
      // 3RD YEAR: 12 SECTIONS (3A-3L)
      // ============================================
      const thirdYearSections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
      for (const letter of thirdYearSections) {
        const sectionCode = `3${letter}`;
        const section = {
          code: sectionCode,
          name: `${sectionCode} - 3rd Year`,
          department: department._id,
          academicYear: '3rd Year',
          year: 3,
          cycle: null,
          capacity: 60
        };
        allSections.push(section);
        console.log(`   ✅ Created: ${sectionCode} - 3rd Year`);
      }

      // ============================================
      // 4TH YEAR: 12 SECTIONS (4A-4L)
      // ============================================
      const fourthYearSections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
      for (const letter of fourthYearSections) {
        const sectionCode = `4${letter}`;
        const section = {
          code: sectionCode,
          name: `${sectionCode} - 4th Year`,
          department: department._id,
          academicYear: '4th Year',
          year: 4,
          cycle: null,
          capacity: 60
        };
        allSections.push(section);
        console.log(`   ✅ Created: ${sectionCode} - 4th Year`);
      }
    }

    // Insert all sections
    await Section.insertMany(allSections);
    
    console.log(`\n🎉 Successfully created ${allSections.length} sections!`);
    console.log(`\n📊 Breakdown per department:`);
    console.log(`   • 2nd Year: 12 sections (2A-2L)`);
    console.log(`   • 3rd Year: 12 sections (3A-3L)`);
    console.log(`   • 4th Year: 12 sections (4A-4L)`);
    console.log(`   • Total: 36 sections per department`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error seeding sections:', error);
    process.exit(1);
  }
};

seedSections();