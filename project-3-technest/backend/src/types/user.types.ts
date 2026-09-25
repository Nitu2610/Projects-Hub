export interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateUserProfileData {
  fullName?: string;
  mobile?: string;
}

export interface ChangeUserPasswordData {
  currentPassword: string;
  newPassword: string;
}