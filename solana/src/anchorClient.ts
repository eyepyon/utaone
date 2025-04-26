import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Connection } from "@solana/web3.js";

import IDL from "./idl.json";
import { Program } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";

const programId_counter = new PublicKey(
  "ENQ2sZ6gFY15EfSP2DkFt37mtAGHVNqUVrZiXZc63mh8"
);

function createProvider(wallet: AnchorWallet, connection: Connection) {
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);
  return provider;
}

export async function createCounter(
  wallet: AnchorWallet,
  connection: Connection
) {
  const provider = createProvider(wallet, connection);
  const program = new Program(IDL, programId_counter, provider);

  const [counter] = PublicKey.findProgramAddressSync(
    [wallet.publicKey.toBytes()],
    program.programId
  );
  console.log("counter", counter.toString());

  return await program.methods
    .createCounter()
    .accounts({
      authority: wallet.publicKey,
      counter: counter,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
}

export async function fetchCounter(
  wallet: AnchorWallet,
  connection: Connection
) {
  const provider = createProvider(wallet, connection);
  const program = new Program(IDL, programId_counter, provider);

  const [counter] = PublicKey.findProgramAddressSync(
    [wallet.publicKey.toBytes()],
    program.programId
  );

  const counterAccount = await program.account.Counter.fetch(counter);
  console.log(
    "Counter account data:",
    (counterAccount as any).count.toNumber()
  );

  return counterAccount as { count: anchor.BN };
}

export async function updateCounter(
  wallet: AnchorWallet,
  connection: Connection
) {
  const provider = createProvider(wallet, connection);
  const program = new Program(IDL, programId_counter, provider);

  const [counter] = PublicKey.findProgramAddressSync(
    [wallet.publicKey.toBytes()],
    program.programId
  );

  const tx = await program.methods
    .updateCounter() // Assuming updateCounter increments by 1
    .accounts({
      counter: counter,
    })
    .rpc();
  console.log("Your transaction signature", tx);

  return tx;
}
