import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Scratch } from "../target/types/scratch";
import { BN } from "bn.js";
import { expect } from "chai";

const { SystemProgram, LAMPORTS_PER_SOL } = anchor.web3;

describe("scratch", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Scratch as Program<Scratch>;

  async function createUser() {
    let user = anchor.web3.Keypair.generate();
    let sig = await provider.connection.requestAirdrop(
      user.publicKey, 10 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(sig);

    let wallet = new anchor.Wallet(user);
    let userProvider = new anchor.AnchorProvider(
      provider.connection, wallet, provider.opts);
    return {
      key: user,
      wallet,
      provider: userProvider,
    };
  }

  async function initialize(owner, data_id, data) {
    const [ dataPda, bump ] = await anchor.web3.PublicKey.findProgramAddress(
      [ data_id.toString() ], program.programId);
    let userProgram = new anchor.Program(
      program.idl, program.programId, owner.provider);
    await userProgram.rpc.initialize(data_id,data, {
      accounts: {
        user: owner.key.publicKey,
	myAccount: dataPda,
	systemProgram: SystemProgram.programId,
      },
    });
    let data_acc = await userProgram.account.myAccount.fetch(dataPda);
    return { publicKey: dataPda, data: data_acc };
  }

  it("Is initialized!", async () => {
    const bn1 = new BN(1);
    const user = await createUser();
    const res = await initialize(user, bn1, bn1);
    console.log(res);

    // // Add your test here.
    // const tx = await program.methods.initialize().rpc();
    // console.log("Your transaction signature", tx);
  });
});

