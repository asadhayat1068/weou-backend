import dotenv from "dotenv";
dotenv.config();

export const environment = process.env.NODE_ENV;
export const appConfig = {
  port: process.env.PORT || 3000,
  serviceName: process.env.SERVICE_NAME,
};

export const L1_LOTTERY_ENABLED = process.env.L1_LOTTERY_ENABLED || true;
export const L2_LOTTERY_ENABLED = process.env.L2_LOTTERY_ENABLED || true;
export const LATEST_OWNER_ROYALTY_PERCENTAGE_SHARE = Number(
  process.env.LATEST_OWNER_ROYALTY_PERCENTAGE_SHARE || 5
); // set default to 5%
export const OTHER_OWNERS_ROYALTY_PERCENTAGE_SHARE = Number(
  process.env.OTHER_OWNERS_ROYALTY_PERCENTAGE_SHARE || 2.5
); // set default to 2.5%
