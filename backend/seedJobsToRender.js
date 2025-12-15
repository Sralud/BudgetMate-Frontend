// Script to seed jobs to your Render backend
// This will add 15 curated job listings (3 internal + 12 OnlineJobs.ph)

const axios = require('axios');

const RENDER_BACKEND_URL = 'https://budgetmate-backend-ti71.onrender.com';

// Admin credentials
const ADMIN_EMAIL = 'admin@budgetmate.com';
const ADMIN_PASSWORD = 'admin123';

// All 15 job listings (3 internal + 12 OnlineJobs.ph)
const initialJobs = [
    // Internal Jobs
    {
        title: 'Freelance Writing',
        description: 'Write articles for blogs and publications',
        difficulty: 'Easy',
        payRange: '₱ 50–200 per article',
        timeCommitment: '5–10 hrs/week',
        tags: ['Writing', 'Remote', 'Flexible'],
        fullDescription: 'Create engaging content for various online platforms. Perfect for those with strong writing skills and creativity. No prior experience required, but a portfolio helps.',
        requirements: ['Good writing skills', 'Basic grammar knowledge', 'Internet connection'],
        howToStart: 'Sign up on freelancing platforms like Upwork, Fiverr, or Freelancer.com. Create a compelling profile and start bidding on projects.',
        source: 'internal',
        category: 'Other',
        isPublished: true
    },
    {
        title: 'Virtual Assistant',
        description: 'Help businesses with administrative tasks',
        difficulty: 'Easy',
        payRange: '₱ 15–25/hour',
        timeCommitment: '10–20 hrs/week',
        tags: ['Admin', 'Remote', 'Flexible'],
        fullDescription: 'Provide administrative support to businesses remotely. Tasks include email management, scheduling, data entry, and customer service.',
        requirements: ['Organizational skills', 'Good communication', 'Computer literacy', 'Reliable internet'],
        howToStart: 'Create profiles on platforms like Upwork, OnlineJobs.ph, or Virtual Staff Finder. Highlight your organizational and communication skills.',
        source: 'internal',
        category: 'Virtual Assistant',
        isPublished: true
    },
    {
        title: 'Graphic Design',
        description: 'Create visuals for brands',
        difficulty: 'Medium',
        payRange: '₱ 300–1000 per project',
        timeCommitment: 'Flexible',
        tags: ['Creative', 'Design', 'Remote'],
        fullDescription: 'Design logos, social media posts, and marketing materials. Requires knowledge of tools like Canva, Photoshop, or Illustrator.',
        requirements: ['Design software skills', 'Creativity', 'Portfolio'],
        howToStart: 'Build a portfolio and showcase your work on Behance or Dribbble. Apply for gigs on freelancing sites.',
        source: 'internal',
        category: 'Freelance/Remote',
        isPublished: true
    },

    // OnlineJobs.ph - Virtual Assistant Category
    {
        title: 'Executive Virtual Assistant',
        description: 'Support C-level executives with daily operations',
        difficulty: 'Medium',
        payRange: '₱ 20,000–35,000/month',
        timeCommitment: 'Full-time (40 hrs/week)',
        tags: ['Virtual Assistant', 'Executive Support', 'Remote'],
        fullDescription: 'Seeking a highly organized and proactive Executive Virtual Assistant to support senior executives. Responsibilities include calendar management, travel arrangements, email correspondence, meeting coordination, and special project assistance. Must be detail-oriented and able to handle confidential information.',
        requirements: [
            'At least 2 years of VA or executive assistant experience',
            'Excellent English communication skills (written and verbal)',
            'Proficiency in Google Workspace and Microsoft Office',
            'Strong organizational and time management skills',
            'Ability to work independently with minimal supervision',
            'Reliable internet connection (at least 10 Mbps)'
        ],
        howToStart: 'Visit OnlineJobs.ph and search for "Executive Virtual Assistant" positions. Create a professional profile highlighting your administrative experience and skills. Apply directly through the platform.',
        source: 'onlinejobs.ph',
        category: 'Virtual Assistant',
        externalUrl: 'https://www.onlinejobs.ph/jobseekers/jobsearch/executive-virtual-assistant',
        isPublished: true
    },
    {
        title: 'Customer Service Virtual Assistant',
        description: 'Handle customer inquiries and support tickets',
        difficulty: 'Easy',
        payRange: '₱ 15,000–25,000/month',
        timeCommitment: 'Full-time or Part-time',
        tags: ['Virtual Assistant', 'Customer Service', 'Remote'],
        fullDescription: 'Join our customer service team as a Virtual Assistant! You\'ll respond to customer inquiries via email, chat, and phone, resolve issues, process orders, and maintain customer satisfaction. Perfect for those with excellent communication skills and a passion for helping others.',
        requirements: [
            'Good English communication skills',
            'Customer service experience preferred but not required',
            'Patience and problem-solving abilities',
            'Basic computer skills',
            'Stable internet connection',
            'Quiet workspace for calls'
        ],
        howToStart: 'Browse customer service VA positions on OnlineJobs.ph. Filter by "Customer Service" and "Virtual Assistant" categories. Prepare a cover letter emphasizing your communication skills.',
        source: 'onlinejobs.ph',
        category: 'Virtual Assistant',
        externalUrl: 'https://www.onlinejobs.ph/jobseekers/jobsearch/customer-service-virtual-assistant',
        isPublished: true
    },
    {
        title: 'Social Media Virtual Assistant',
        description: 'Manage social media accounts and content',
        difficulty: 'Easy',
        payRange: '₱ 18,000–30,000/month',
        timeCommitment: '20–40 hrs/week',
        tags: ['Virtual Assistant', 'Social Media', 'Content'],
        fullDescription: 'Looking for a creative Social Media VA to manage our clients\' social media presence. Tasks include content scheduling, community engagement, basic graphic design, hashtag research, and performance reporting. Great opportunity to work with multiple brands.',
        requirements: [
            'Familiarity with Facebook, Instagram, Twitter, LinkedIn',
            'Basic graphic design skills (Canva)',
            'Good written English',
            'Understanding of social media trends',
            'Scheduling tools experience (Buffer, Hootsuite) is a plus'
        ],
        howToStart: 'Search for "Social Media Virtual Assistant" on OnlineJobs.ph. Showcase any social media management experience or personal accounts you\'ve grown. Include examples in your application.',
        source: 'onlinejobs.ph',
        category: 'Virtual Assistant',
        externalUrl: 'https://www.onlinejobs.ph/jobseekers/jobsearch/social-media-virtual-assistant',
        isPublished: true
    },
    {
        title: 'Data Entry Virtual Assistant',
        description: 'Accurate data entry and database management',
        difficulty: 'Easy',
        payRange: '₱ 12,000–20,000/month',
        timeCommitment: 'Flexible (20–40 hrs/week)',
        tags: ['Virtual Assistant', 'Data Entry', 'Remote'],
        fullDescription: 'We need detail-oriented Data Entry VAs to input, update, and maintain data in our systems. Tasks include transferring data from PDFs to spreadsheets, CRM updates, data verification, and basic reporting. No experience required - training provided!',
        requirements: [
            'Fast and accurate typing skills (40+ WPM)',
            'Attention to detail',
            'Basic Excel/Google Sheets knowledge',
            'Reliable internet connection',
            'Ability to follow instructions precisely'
        ],
        howToStart: 'Filter OnlineJobs.ph by "Data Entry" positions. Take typing speed tests to include in your application. Emphasize your accuracy and attention to detail.',
        source: 'onlinejobs.ph',
        category: 'Virtual Assistant',
        externalUrl: 'https://www.onlinejobs.ph/jobseekers/jobsearch/data-entry',
        isPublished: true
    },

    // OnlineJobs.ph - Freelance/Remote Category
    {
        title: 'Content Writer (SEO)',
        description: 'Write SEO-optimized articles and blog posts',
        difficulty: 'Medium',
        payRange: '₱ 100–300 per article',
        timeCommitment: 'Flexible (10–30 hrs/week)',
        tags: ['Freelance', 'Writing', 'SEO', 'Remote'],
        fullDescription: 'Seeking talented content writers to create SEO-optimized articles for various niches including tech, health, finance, and lifestyle. You\'ll research topics, write engaging content, and optimize for search engines. Great for building your portfolio!',
        requirements: [
            'Excellent English writing skills',
            'Basic SEO knowledge (keywords, meta descriptions)',
            'Research skills',
            'Ability to meet deadlines',
            'Plagiarism-free original content',
            'WordPress experience is a plus'
        ],
        howToStart: 'Search for "Content Writer" or "SEO Writer" on OnlineJobs.ph. Prepare writing samples in different niches. Consider taking free SEO courses to boost your application.',
        source: 'onlinejobs.ph',
        category: 'Freelance/Remote',
        externalUrl: 'https://www.onlinejobs.ph/jobseekers/jobsearch/content-writer',
        isPublished: true
    },
    {
        title: 'Web Developer (WordPress)',
        description: 'Build and maintain WordPress websites',
        difficulty: 'Medium',
        payRange: '₱ 25,000–50,000/month',
        timeCommitment: 'Full-time or Project-based',
        tags: ['Freelance', 'Web Development', 'WordPress', 'Remote'],
        fullDescription: 'Join our development team to create custom WordPress websites for clients. Responsibilities include theme customization, plugin integration, site optimization, bug fixes, and ongoing maintenance. Work on diverse projects from e-commerce to corporate sites.',
        requirements: [
            'Strong WordPress development experience',
            'HTML, CSS, JavaScript, PHP knowledge',
            'Familiarity with page builders (Elementor, Divi)',
            'Responsive design skills',
            'Problem-solving abilities',
            'Portfolio of WordPress sites'
        ],
        howToStart: 'Browse "WordPress Developer" positions on OnlineJobs.ph. Create a portfolio showcasing your best WordPress projects. Include live site links and describe your role in each project.',
        source: 'onlinejobs.ph',
        category: 'Freelance/Remote',
        externalUrl: 'https://www.onlinejobs.ph/jobseekers/jobsearch/wordpress-developer',
        isPublished: true
    },
    {
        title: 'Graphic Designer',
        description: 'Create visual content for digital marketing',
        difficulty: 'Medium',
        payRange: '₱ 20,000–40,000/month',
        timeCommitment: 'Full-time or Part-time',
        tags: ['Freelance', 'Design', 'Graphics', 'Remote'],
        fullDescription: 'Creative Graphic Designer needed to produce stunning visuals for social media, websites, and marketing materials. You\'ll work on logos, banners, infographics, email templates, and more. Opportunity to work with international clients.',
        requirements: [
            'Proficiency in Adobe Photoshop, Illustrator, or similar tools',
            'Strong portfolio demonstrating design skills',
            'Understanding of design principles and color theory',
            'Ability to follow brand guidelines',
            'Good communication skills',
            'Canva and Figma experience is a plus'
        ],
        howToStart: 'Search "Graphic Designer" on OnlineJobs.ph. Build a strong portfolio on Behance or create a PDF showcasing your best work. Tailor your portfolio to the job you\'re applying for.',
        source: 'onlinejobs.ph',
        category: 'Freelance/Remote',
        externalUrl: 'https://www.onlinejobs.ph/jobseekers/jobsearch/graphic-designer',
        isPublished: true
    },
    {
        title: 'Video Editor',
        description: 'Edit videos for YouTube and social media',
        difficulty: 'Medium',
        payRange: '₱ 15,000–35,000/month',
        timeCommitment: 'Flexible (20–40 hrs/week)',
        tags: ['Freelance', 'Video Editing', 'Creative', 'Remote'],
        fullDescription: 'Looking for skilled Video Editors to create engaging content for YouTube channels and social media platforms. Tasks include cutting footage, adding effects, color grading, audio mixing, and creating thumbnails. Work with content creators and brands.',
        requirements: [
            'Experience with Adobe Premiere Pro, Final Cut Pro, or DaVinci Resolve',
            'Understanding of pacing, storytelling, and engagement',
            'Audio editing skills',
            'Knowledge of YouTube best practices',
            'Portfolio of edited videos',
            'After Effects knowledge is a bonus'
        ],
        howToStart: 'Find "Video Editor" jobs on OnlineJobs.ph. Create a showreel highlighting your best editing work. Include before/after examples and specify the tools you used.',
        source: 'onlinejobs.ph',
        category: 'Freelance/Remote',
        externalUrl: 'https://www.onlinejobs.ph/jobseekers/jobsearch/video-editor',
        isPublished: true
    },

    // OnlineJobs.ph - Part-time Category
    {
        title: 'Part-time Bookkeeper',
        description: 'Manage financial records and transactions',
        difficulty: 'Medium',
        payRange: '₱ 10,000–20,000/month',
        timeCommitment: 'Part-time (10–20 hrs/week)',
        tags: ['Part-time', 'Accounting', 'Bookkeeping', 'Remote'],
        fullDescription: 'Part-time Bookkeeper needed to maintain accurate financial records for small businesses. Responsibilities include recording transactions, reconciling accounts, preparing reports, and managing invoices. Perfect for accounting students or those seeking flexible work.',
        requirements: [
            'Basic accounting knowledge',
            'Experience with QuickBooks or Xero preferred',
            'Attention to detail and accuracy',
            'Excel/Google Sheets proficiency',
            'Understanding of basic financial principles',
            'Accounting degree or certification is a plus'
        ],
        howToStart: 'Search for "Part-time Bookkeeper" on OnlineJobs.ph. Highlight any accounting coursework or certifications. Emphasize your attention to detail and reliability.',
        source: 'onlinejobs.ph',
        category: 'Part-time',
        externalUrl: 'https://www.onlinejobs.ph/jobseekers/jobsearch/bookkeeper-part-time',
        isPublished: true
    },
    {
        title: 'Part-time Transcriptionist',
        description: 'Transcribe audio and video files to text',
        difficulty: 'Easy',
        payRange: '₱ 50–150 per audio hour',
        timeCommitment: 'Flexible (5–15 hrs/week)',
        tags: ['Part-time', 'Transcription', 'Flexible', 'Remote'],
        fullDescription: 'Transcribe audio recordings, interviews, podcasts, and videos into accurate written text. Work on your own schedule and choose projects that fit your availability. Great for students or those looking for extra income.',
        requirements: [
            'Excellent English listening and typing skills',
            'Fast typing speed (50+ WPM)',
            'Good grammar and punctuation',
            'Headphones and quiet workspace',
            'Attention to detail',
            'Familiarity with transcription software is helpful'
        ],
        howToStart: 'Look for "Transcriptionist" positions on OnlineJobs.ph. Take a typing test and include your WPM in applications. Start with easier projects to build your reputation.',
        source: 'onlinejobs.ph',
        category: 'Part-time',
        externalUrl: 'https://www.onlinejobs.ph/jobseekers/jobsearch/transcriptionist',
        isPublished: true
    },
    {
        title: 'Part-time Online Tutor',
        description: 'Teach English or academic subjects online',
        difficulty: 'Easy',
        payRange: '₱ 150–400 per hour',
        timeCommitment: 'Flexible (5–20 hrs/week)',
        tags: ['Part-time', 'Teaching', 'Education', 'Remote'],
        fullDescription: 'Share your knowledge as an online tutor! Teach English, Math, Science, or other subjects to students of all ages. Set your own schedule and rates. Perfect for teachers, college students, or professionals with expertise to share.',
        requirements: [
            'Strong knowledge in subject area',
            'Good communication and teaching skills',
            'Patience and enthusiasm',
            'Reliable internet and webcam',
            'Teaching experience or certification is a plus',
            'Bachelor\'s degree preferred for some subjects'
        ],
        howToStart: 'Search "Online Tutor" or "ESL Teacher" on OnlineJobs.ph. Create a profile highlighting your expertise and teaching style. Consider getting TESOL/TEFL certification for ESL positions.',
        source: 'onlinejobs.ph',
        category: 'Part-time',
        externalUrl: 'https://www.onlinejobs.ph/jobseekers/jobsearch/online-tutor',
        isPublished: true
    },
    {
        title: 'Part-time Email Support Specialist',
        description: 'Respond to customer emails and inquiries',
        difficulty: 'Easy',
        payRange: '₱ 8,000–15,000/month',
        timeCommitment: 'Part-time (15–25 hrs/week)',
        tags: ['Part-time', 'Customer Support', 'Email', 'Remote'],
        fullDescription: 'Join our email support team to help customers with their questions and concerns. You\'ll respond to emails, provide product information, troubleshoot issues, and ensure customer satisfaction. Flexible schedule with evening/weekend options available.',
        requirements: [
            'Good English writing skills',
            'Customer service mindset',
            'Ability to type clear and professional emails',
            'Basic problem-solving skills',
            'Reliable internet connection',
            'Previous customer service experience helpful'
        ],
        howToStart: 'Filter OnlineJobs.ph by "Email Support" and "Part-time". Prepare a professional email as a writing sample. Highlight your availability and communication skills.',
        source: 'onlinejobs.ph',
        category: 'Part-time',
        externalUrl: 'https://www.onlinejobs.ph/jobseekers/jobsearch/email-support',
        isPublished: true
    }
];

async function seedJobsToRender() {
    try {
        console.log('🚀 Starting job seeding to Render backend...\n');
        console.log('Step 1: Logging in as admin...');

        // Login to get auth token
        const loginResponse = await axios.post(
            `${RENDER_BACKEND_URL}/api/auth/login`,
            {
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD
            }
        );

        const token = loginResponse.data.token;
        console.log('✅ Logged in successfully!\n');

        console.log(`Step 2: Creating ${initialJobs.length} job listings...`);
        console.log('   - 3 Internal jobs');
        console.log('   - 12 OnlineJobs.ph jobs\n');

        let successCount = 0;
        let errorCount = 0;

        // Create each job
        for (const job of initialJobs) {
            try {
                await axios.post(
                    `${RENDER_BACKEND_URL}/api/jobs`,
                    job,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                successCount++;
                const badge = job.source === 'onlinejobs.ph' ? '🟢' : '🔵';
                console.log(`  ${badge} Created: ${job.title}`);
            } catch (error) {
                errorCount++;
                console.error(`  ❌ Failed: ${job.title} - ${error.response?.data?.message || error.message}`);
            }
        }

        console.log(`\n✅ Done!`);
        console.log(`Successfully created: ${successCount} jobs`);
        if (errorCount > 0) {
            console.log(`Failed: ${errorCount} jobs`);
        }

        console.log('\n📱 Next steps:');
        console.log('   1. Refresh your mobile app (shake device and tap "Reload")');
        console.log('   2. Navigate to the Earn tab');
        console.log('   3. You should see all 15 jobs with category filters!');

    } catch (error) {
        if (error.response) {
            console.error('❌ Error:', error.response.data.message);
            console.error('Status:', error.response.status);
        } else if (error.request) {
            console.error('❌ Network error: Could not reach the Render backend');
            console.error('Make sure the backend URL is correct:', RENDER_BACKEND_URL);
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

seedJobsToRender();
