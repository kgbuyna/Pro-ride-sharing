import { Context } from "@oak/oak/context";

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

export type AppContext = Context & {
  response: Context["response"] & { body: ApiResponse };
};
