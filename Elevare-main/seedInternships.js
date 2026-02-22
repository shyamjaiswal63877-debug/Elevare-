require('dotenv').config();
const mongoose = require('mongoose');
const Internship = require('./models/Internship');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elevare';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected for seeding'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Sample internship data
const internships = [
    {
        title: 'Frontend Developer Intern',
        company: 'TechCorp Inc.',
        location: 'Remote',
        icon: '🚀',
        description: 'Join our frontend team to build amazing user interfaces using React, TypeScript, and modern web technologies.',
        tags: ['React', 'TypeScript', 'CSS'],
        category: 'TECH',
        duration: '3-6 months',
        stipend: '₹15,000/month',
        type: 'Remote',
        requirements: [
            'Strong knowledge of React and JavaScript',
            'Experience with TypeScript',
            'Understanding of responsive design'
        ],
        responsibilities: [
            'Build reusable UI components',
            'Collaborate with design team',
            'Write clean, maintainable code'
        ]
    },
    {
        title: 'Marketing Analytics Intern',
        company: 'DataDriven Solutions',
        location: 'Mumbai, India',
        icon: '📊',
        description: 'Help analyze marketing campaigns and create data-driven insights to optimize marketing strategies.',
        tags: ['Analytics', 'SQL', 'Marketing'],
        category: 'MARKETING',
        duration: '3 months',
        stipend: '₹10,000/month',
        type: 'Hybrid',
        requirements: [
            'Basic knowledge of SQL and Excel',
            'Interest in data analysis',
            'Good communication skills'
        ],
        responsibilities: [
            'Analyze marketing campaign data',
            'Create reports and dashboards',
            'Present insights to stakeholders'
        ]
    },
    {
        title: 'UI/UX Design Intern',
        company: 'Creative Studio',
        location: 'Bangalore, India',
        icon: '🎨',
        description: 'Create beautiful and intuitive user experiences for web and mobile applications.',
        tags: ['Figma', 'Adobe Creative', 'Prototyping'],
        category: 'DESIGN',
        duration: '4 months',
        stipend: '₹12,000/month',
        type: 'On-site',
        requirements: [
            'Proficiency in Figma or Adobe XD',
            'Portfolio of design work',
            'Understanding of UX principles'
        ],
        responsibilities: [
            'Design wireframes and mockups',
            'Create interactive prototypes',
            'Conduct user research'
        ]
    },
    {
        title: 'Business Analyst Intern',
        company: 'Insight Partners',
        location: 'Remote',
        icon: '📈',
        description: 'Work with stakeholders to document requirements and improve operational processes.',
        tags: ['Excel', 'Communication', 'Problem Solving'],
        category: 'BUSINESS',
        duration: '3 months',
        stipend: '₹8,000/month',
        type: 'Remote',
        requirements: [
            'Strong analytical skills',
            'Proficiency in MS Office',
            'Excellent communication skills'
        ],
        responsibilities: [
            'Document business requirements',
            'Create process flow diagrams',
            'Support stakeholder meetings'
        ]
    },
    {
        title: 'Backend Developer Intern',
        company: 'CloudTech Systems',
        location: 'Hyderabad, India',
        icon: '⚙️',
        description: 'Build scalable APIs and microservices using Node.js, Python, and cloud technologies.',
        tags: ['Node.js', 'Python', 'AWS'],
        category: 'TECH',
        duration: '6 months',
        stipend: '₹18,000/month',
        type: 'Hybrid',
        requirements: [
            'Knowledge of Node.js or Python',
            'Understanding of REST APIs',
            'Basic knowledge of databases'
        ],
        responsibilities: [
            'Develop RESTful APIs',
            'Write unit tests',
            'Deploy to cloud platforms'
        ]
    },
    {
        title: 'Social Media Marketing Intern',
        company: 'BrandBoost Agency',
        location: 'Delhi, India',
        icon: '📱',
        description: 'Manage social media campaigns and create engaging content for various platforms.',
        tags: ['Content Creation', 'Social Media', 'Canva'],
        category: 'MARKETING',
        duration: '3 months',
        stipend: '₹7,000/month',
        type: 'Remote',
        requirements: [
            'Active on social media platforms',
            'Creative content creation skills',
            'Basic design skills (Canva)'
        ],
        responsibilities: [
            'Create social media posts',
            'Schedule and publish content',
            'Engage with audience'
        ]
    }
];

// Seed the database
async function seedInternships() {
    try {
        // Clear existing internships
        await Internship.deleteMany({});
        console.log('🗑️  Cleared existing internships');
        
        // Insert sample data
        await Internship.insertMany(internships);
        console.log(`✅ Successfully seeded ${internships.length} internships`);
        
        // Display inserted data
        const allInternships = await Internship.find();
        console.log('\n📋 Internships in database:');
        allInternships.forEach((internship, index) => {
            console.log(`${index + 1}. ${internship.title} at ${internship.company}`);
        });
        
        mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error seeding internships:', error);
        mongoose.connection.close();
    }
}

seedInternships();
