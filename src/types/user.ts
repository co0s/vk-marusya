export interface IUser {
  email: string;
  name: string;
  surname?: string;
  favoriteGenres?: string[];
  password?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname?: string;
}

export interface AuthResponse {
  user: IUser;
  token?: string;
}