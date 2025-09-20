// A very simple mock auth service using localStorage.
// WARNING: This is NOT secure and for demonstration purposes only.
import type { User } from '../types';

const USERS_KEY = 'football_ai_users';
const SESSION_KEY = 'football_ai_session';
export const MESSAGE_LIMIT = 15;

// Simulate a user database
const getUsers = (): Record<string, { passwordHash: string; user: User }> => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
};

const saveUsers = (users: Record<string, { passwordHash: string; user: User }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// A simple "hashing" function for the demo.
const hashPassword = (password: string) => `hashed_${password}_salt`;

export const authService = {
  signUp: (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        if (users[username.toLowerCase()]) {
          return reject(new Error("Username already exists."));
        }
        const newUser: User = { username, messagesSent: 0 };
        users[username.toLowerCase()] = {
          passwordHash: hashPassword(password),
          user: newUser,
        };
        saveUsers(users);
        authService.login(username, password).then(resolve).catch(reject);
      }, 500);
    });
  },

  login: (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const userData = users[username.toLowerCase()];
        if (userData && userData.passwordHash === hashPassword(password)) {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData.user));
          return resolve(userData.user);
        }
        return reject(new Error("Invalid username or password."));
      }, 500);
    });
  },

  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      sessionStorage.removeItem(SESSION_KEY);
      resolve();
    });
  },

  getCurrentUser: (): User | null => {
    const session = sessionStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  incrementMessageCount: (username: string): Promise<User> => {
      return new Promise((resolve, reject) => {
          const users = getUsers();
          const userData = users[username.toLowerCase()];
          if (!userData) {
              return reject(new Error("User not found"));
          }
          
          userData.user.messagesSent += 1;
          saveUsers(users);

          // Also update the session user
          const sessionUser = authService.getCurrentUser();
          if (sessionUser && sessionUser.username.toLowerCase() === username.toLowerCase()) {
              sessionUser.messagesSent = userData.user.messagesSent;
              sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
          }
          
          resolve(userData.user);
      });
  }
};
