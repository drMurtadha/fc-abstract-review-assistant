import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { deleteDoc, doc, getDoc, getDocs, getFirestore, collection, setDoc } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import type { ReviewResult, SubmissionInput } from '../types';

export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyBrZUzQy2emIyrgsnIdndhDPkanFDVJOE8',
  authDomain: 'fc-abstract-review-assistant.firebaseapp.com',
  projectId: 'fc-abstract-review-assistant',
  storageBucket: 'fc-abstract-review-assistant.firebasestorage.app',
  messagingSenderId: '311687430124',
  appId: '1:311687430124:web:dcc5a862d0764ab5268ac9'
});

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
  }
}

// Debug mode lets App Check work on localhost, where the reCAPTCHA site key isn't
// registered. Never active in a production build. Set VITE_APPCHECK_DEBUG_TOKEN in a
// local, gitignored .env.local to pin a stable token; otherwise the SDK generates one
// and logs it to the console on first run — register that value in the Firebase
// Console under App Check > Manage debug tokens.
if (import.meta.env.DEV) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = (import.meta.env.VITE_APPCHECK_DEBUG_TOKEN as string | undefined) || true;
}

const RECAPTCHA_ENTERPRISE_SITE_KEY = '6Le0lLstAAAAAB482v98Gy3WmpZXc1lFMVnOmwOW';
initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_ENTERPRISE_SITE_KEY),
  isTokenAutoRefreshEnabled: true
});

export const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ hd: 'utm.my' });

const clean = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
export const isUtmUser = (user: User) => Boolean(user.email?.toLowerCase().endsWith('@utm.my'));

export function watchAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function signInUtm(): Promise<User> {
  const result = await signInWithPopup(auth, provider);
  if (!isUtmUser(result.user)) {
    await signOut(auth);
    throw new Error('Please sign in with an authorised @utm.my account.');
  }
  return result.user;
}

export const signOutUser = () => signOut(auth);

export async function saveCloudReview(review: ReviewResult): Promise<void> {
  const user = auth.currentUser;
  if (!user || !isUtmUser(user)) throw new Error('UTM sign-in is required.');
  const id = review.submission.submissionId;
  if (!id) throw new Error('Submission ID is required.');
  await setDoc(doc(db, 'submissions', id), clean({
    ...review,
    backendSaved: true,
    syncWarning: '',
    ownerUid: user.uid,
    ownerEmail: user.email,
    updatedAt: new Date().toISOString()
  }), { merge: true });
}

export async function listCloudReviews(): Promise<ReviewResult[]> {
  const snapshot = await getDocs(collection(db, 'submissions'));
  return snapshot.docs
    .map((entry) => entry.data() as ReviewResult)
    .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
}

export async function loadCloudDraft(): Promise<SubmissionInput | undefined> {
  const user = auth.currentUser;
  if (!user) return undefined;
  const snapshot = await getDoc(doc(db, 'drafts', user.uid));
  return snapshot.exists() ? snapshot.data().form as SubmissionInput : undefined;
}

export async function saveCloudDraft(form: SubmissionInput): Promise<void> {
  const user = auth.currentUser;
  if (!user || !isUtmUser(user)) return;
  await setDoc(doc(db, 'drafts', user.uid), clean({ form, updatedAt: new Date().toISOString() }));
}

export async function clearCloudDraft(): Promise<void> {
  const user = auth.currentUser;
  if (user) await deleteDoc(doc(db, 'drafts', user.uid));
}
