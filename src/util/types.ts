export interface UserAddress {
  firstName: string;
  lastName?: string;
  email: string;
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ClaimRequest {
  walletAddress: string;
  txId: string;
  level: "l1" | "l2";
  address?: UserAddress;
}
