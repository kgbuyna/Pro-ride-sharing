import { Context } from "@oak/oak/context";

export type id = number & { __brand: "id" };
// Generic Response Type
export type ApiResponse = {
  status?: "success" | "error"; // Indicates if the operation was successful
  message: string; // Brief message for the client
  data?: any; // Optional: Contains the response data for successful operations
  error?: {
    code: number; // Application-specific error code
    details: string; // Detailed error description
  }; // Optional: Contains error information
};

export type AppContext = Context & {
  response: Context["response"] & { body: ApiResponse };
};
