import { BigNumberish, Contract, ethers } from "ethers";
import { COLLECTION_ADDRESS, wss_provider } from "../config";
import { logger } from "../util";
const _IdToSKU_Cache: { [key: string]: string } = {};

const contract_address = COLLECTION_ADDRESS;

const contract_abi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];

export const contract = new Contract(
  contract_address,
  contract_abi,
  wss_provider
);

export const Events = {
  Transfer: contract.filters.Transfer(null, null, null),
};

export const Transfer_handler = async (
  from: string,
  to: string,
  id: BigNumberish,
  transactionHash: string
) => {
  logger.info("TRANSFER", {
    from,
    to,
    id,
    transactionHash,
  });
};
