// Role type (unified!)
export type Role = 'administrateur' | 'employé' | 'utilisateur';

// User interface (unified!)
export interface User {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  role?: Role; // Mark as optional if your API may omit it
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
  };
}


