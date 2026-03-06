import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, 'users.json');

async function exportUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find();

        const usersData = users.map(u => ({ id: u._id, name: u.name, email: u.email, createdAt: u.createdAt }));

        fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
        console.log(`Exported ${usersData.length} users to users.json successfully.`);
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}

exportUsers();
