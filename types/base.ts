import { Context } from "@oak/oak/context";
import { State } from "@oak/oak/application";
import { Response } from "@oak/oak/response";

export type id = number & { __brand: "id" };
// Generic Response Type
export type ApiResponse =
  | {
    status?: "success" | "error"; // Indicates if the operation was successful
    message: string; // Required when `message` is used
    messages?: never; // Ensures `messages` cannot be used simultaneously
    data?: any; // Optional: Contains the response data for successful operations
    error?: {
      code: number; // Application-specific error code
      details: string; // Detailed error description
    }; // Optional: Contains error information
  }
  | {
    status?: "success" | "error"; // Indicates if the operation was successful
    message?: never; // Ensures `message` cannot be used simultaneously
    messages: string[]; // Required when `messages` is used
    data?: any; // Optional: Contains the response data for successful operations
    error?: {
      code: number; // Application-specific error code
      details: string; // Detailed error description
    }; // Optional: Contains error information
  };

// export type AppContext<
//   T extends State = Record<string, any>,
//   K extends State = Record<string, any>,
// > =
//   & Context<T, K>
//   & {
//     response: Context["response"] & { body: ApiResponse };
//   };
export interface AppContext<
  StateT extends State = ContextState,
  CustomT extends State = Record<string, any>,
> extends Context<StateT, CustomT> {
  response: Response & { body: ApiResponse };
}

export type ContextState = {
  userId: id;
  username: string;
};
