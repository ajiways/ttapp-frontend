export interface AuthResponse {
  expiration: string;
  userId: string;
  token: string;
  groupId: string;
  userRoles: {
    id: string;
    title: string;
  }[];
}
