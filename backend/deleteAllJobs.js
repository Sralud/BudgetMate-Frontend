// Quick script to delete ALL jobs from Render
// Run this to clean up before reseeding

const axios = require('axios');

const RENDER_BACKEND_URL = 'https://budgetmate-backend-ti71.onrender.com';
const ADMIN_EMAIL = 'admin@budgetmate.com';
const ADMIN_PASSWORD = 'admin123';

async function deleteAllJobs() {
    try {
        console.log('🗑️  Deleting all jobs from Render...\n');

        // Login
        const loginResponse = await axios.post(
            `${RENDER_BACKEND_URL}/api/auth/login`,
            { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
        );
        const token = loginResponse.data.token;

        // Get all jobs
        const getResponse = await axios.get(`${RENDER_BACKEND_URL}/api/jobs`);
        const jobs = getResponse.data.jobs || [];
        console.log(`Found ${jobs.length} jobs to delete\n`);

        // Delete each job
        for (const job of jobs) {
            try {
                await axios.delete(
                    `${RENDER_BACKEND_URL}/api/jobs/${job._id}`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                console.log(`✅ Deleted: ${job.title}`);
            } catch (error) {
                console.error(`❌ Failed: ${job.title}`);
            }
        }

        console.log(`\n✅ Done! Deleted ${jobs.length} jobs`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

deleteAllJobs();
