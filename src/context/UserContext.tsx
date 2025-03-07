import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, db } from '@/services/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

interface User {
	uid: string;
	email: string | null;
	firstName: string | null;
	lastName: string | null;
	avatar: string | null;
	phone: string | null;
	address: string | null;
}

// Define Context Type
interface UserContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	logout: () => void;
}

// Create Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Context Provider
export function UserProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
			if (firebaseUser) {
				const userRef = ref(db, `users/${firebaseUser.uid}`);
				const snapshot = await get(userRef);
				if (snapshot.exists()) {
					const userData = snapshot.val();
					setUser({
						uid: firebaseUser.uid,
						email: firebaseUser.email,
						firstName: userData.firstName,
						lastName: userData.lastName,
						avatar: userData.avatar,
						phone: userData.phone,
						address: userData.address,
					});
				}
			} else {
				setUser(null);
			}
		});

		return () => unsubscribe();
	}, []);

	const logout = async () => {
		try {
			await signOut(auth);
			setUser(null);
			router.push('/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
}

export function useUser() {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
}
