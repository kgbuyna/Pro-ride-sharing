import { id } from "./base.ts";

/**
 * Type for the parameters of the `newMessage` event sent from the server to the client.
 */
export type NewMessageParams = {
  /** The content of the message being sent. */
  message: string;
  /** The unique ID of the conversation to which this message belongs. */
  conversationId: id;
};

/**
 * Interface for events sent from the server to the client.
 */
export interface ServerToClientEvents {
  /**
   * Emitted when a new message is sent to the client.
   *
   * @param params - Contains the message content and conversation ID.
   */
  newMessage: (params: NewMessageParams) => void;
}

/**
 * Type for the parameters of the `message` event sent from the client to the server.
 */
export type MessageParams = {
  /** The content of the message the client is sending. */
  content: string;
  /** The ID of the user or group the message is being sent to. */
  recipient: id;
  /** The unique ID of the conversation in which this message should be posted. */
  conversationId: id;
};

/**
 * Interface for events sent from the client to the server.
 */
export interface ClientToServerEvents {
  /**
   * Emitted when the client sends a new message.
   *
   * @param params - Contains the message content, recipient ID, and conversation ID.
   */
  message: (params: MessageParams) => void;
}
