export {};

declare global {
    namespace Express {
      export interface Request {
          userId?: string;
          user?: { id: string };
      }
    }
}