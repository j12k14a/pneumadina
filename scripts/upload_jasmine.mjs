import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = {
  projectId: "pneumadina-611a2",
  apiKey: "AIzaSyAGRJ-hjIgAFj-kWmCJUg8QkNUPpwhPePg"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const post = JSON.parse(fs.readFileSync('/mnt/c/Users/user/.gemini/antigravity/scratch/pnewmadina/client/src/data/jasmine_post.json', 'utf8'));

console.log('Uploading Jasmine article to Cloud Firestore:', post.title);

await setDoc(doc(db, 'posts', String(post.id)), post);

console.log('Successfully saved to Cloud Firestore posts collection!');
process.exit(0);
