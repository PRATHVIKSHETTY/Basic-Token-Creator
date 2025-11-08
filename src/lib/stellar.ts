import {
  SorobanRpc,
  Networks,
  Account,
  TransactionBuilder,
  BASE_FEE,
  Operation,
  HostFunction,
  nativeToScVal,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const server = new SorobanRpc.Server(
  "https://soroban-testnet.stellar.org"
);
export const CONTRACT_ID =
  "CC3LVU2R3IFXK2EGFUNHJAGCJM5DE6DJZRXMGZMWBTRV2GVLNEK3ML3R";

export const createToken = async (
  name: string,
  symbol: string,
  supply: bigint | number | string,
  walletAddress: string
) => {
  const supplyBigInt = BigInt(supply);

  // Load account
  const accResp = await server.getAccount(walletAddress);
  const account = new Account(walletAddress, accResp.sequenceNumber());

  // Build HostFunction
  const hostFunction = HostFunction.invokeContract(
    CONTRACT_ID,
    "create_token",
    [
      nativeToScVal(name),
      nativeToScVal(symbol),
      nativeToScVal(supplyBigInt),
    ]
  );

  // Build Transaction
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(Operation.invokeHostFunction({ func: hostFunction }))
    .setTimeout(30)
    .build();

  // Prepare transaction
  const preparedTx = await server.prepareTransaction(tx);

  // Sign via Freighter
  const { signedTxXdr } = await signTransaction(preparedTx.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  // Submit signed XDR directly
  const response = await server.sendTransaction(signedTxXdr);

  return {
    txHash: response.hash,
    tokenId: CONTRACT_ID,
  };
};
