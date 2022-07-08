use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod scratch {
    use super::*;
    pub fn initialize(
        ctx: Context<Initialize>,
        _data_id: u64,
        data: u64,
    ) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        my_account.data = data;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(data_id: u64, data: u64)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(init,
        payer = user,
        space = 8 + 8,
        seeds = [ data_id.to_string().as_bytes() ],
        bump)]
    pub my_account: Account<'info, MyAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct MyAccount {
    pub data: u64
}

