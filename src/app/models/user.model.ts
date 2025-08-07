export type Role = 'administrateur' | 'employé' | 'utilisateur';

export interface User {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  role?: Role;
  createdAt?: string;
  updatedAt?: string;
}
export interface UserResponse {
  message: string;
  data: {
    user: User;
  };
}
