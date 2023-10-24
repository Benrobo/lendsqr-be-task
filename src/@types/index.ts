export enum RESPONSE_CODE {
  // Common Responses
  INVALID_FIELDS,
  USER_NOT_FOUND,
  USER_ALREADY_EXIST,
  INVALID_EMAIL,
  INVALID_LOGIN_CREDENTIALS,
  INTERNAL_SERVER_ERROR,

  // User Operations
  SIGNUP_SUCCESSFULL,
  LOGIN_SUCCESSFULL,
  UNAUTHORIZED,
  FORBIDDEN,
  INVALID_TRANSACTION_PIN,

  // Transaction Responses
  TRANSACTION_PIN_UPDATED_SUCCESSFULL,
  WALLET_FUNDED_SUCCESSFULL,
  VALIDATION_ERROR,
  RECEPIENT_NOT_FOUND,
  SELF_TRANSFER_NOT_ALLOWED,
  TRANSFER_SUCCESSFULL,
  INSUFFICIENT_FUNDS,
  WITHDRAWAL_SUCCESSFULL,
  TRANSACTIONS_FETCHED_SUCCESSFULL,
}

export interface decodedJWT {
  userId: string;
}

export interface FundWalletType {
  pin: string;
  amount: number;
}

export interface TransferFunds {
  pin: string;
  amount: number;
  recepient_email: string;
}

export interface UserTransferDetails {
  email: string;
  id: string;
  balance: number;
  transaction_pin: string;
}

export enum TransactionType {
  success,
  failed,
}
