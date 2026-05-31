export interface User {
  id: string;
  username: string;
  passwordHash: string;
}

export interface SessionPayload {
  userId: string;
  username: string;
}
