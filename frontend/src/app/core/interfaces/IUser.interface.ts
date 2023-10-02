/**
 * A reflection of the User entity in the database (excluding data the client should not receive)
 */
export interface IUser {
  id: number;
  username: string;
}