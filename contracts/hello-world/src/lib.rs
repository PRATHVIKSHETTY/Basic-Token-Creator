#![allow(non_snake_case)]
#![no_std]
use soroban_sdk::{contract, contracttype, contractimpl, log, Env, Symbol, String, Address, symbol_short};

// Structure to store token metadata
#[contracttype]
#[derive(Clone)]
pub struct TokenInfo {
    pub token_id: u64,
    pub name: String,
    pub symbol: String,
    pub total_supply: i128,
    pub creator: Address,
    pub created_at: u64,
}

// Mapping token_id to TokenInfo
#[contracttype]
pub enum TokenBook {
    Token(u64)
}

// Counter for generating unique token IDs
const TOKEN_COUNTER: Symbol = symbol_short!("T_COUNT");

// Symbol for tracking total tokens created
const TOTAL_TOKENS: Symbol = symbol_short!("T_TOTAL");

#[contract]
pub struct BasicTokenCreator;

#[contractimpl]
impl BasicTokenCreator {
    
    /// Creates a new token with specified name, symbol, and total supply
    /// Returns the unique token_id
    pub fn create_token(
        env: Env, 
        creator: Address,
        name: String, 
        symbol: String, 
        total_supply: i128
    ) -> u64 {
        // Verify the creator is authorized
        creator.require_auth();
        
        // Validate inputs
        if total_supply <= 0 {
            log!(&env, "Total supply must be greater than 0");
            panic!("Invalid total supply");
        }
        
        // Get and increment token counter
        let mut token_count: u64 = env.storage().instance().get(&TOKEN_COUNTER).unwrap_or(0);
        token_count += 1;
        
        // Get current timestamp
        let timestamp = env.ledger().timestamp();
        
        // Create token info
        let token_info = TokenInfo {
            token_id: token_count,
            name: name.clone(),
            symbol: symbol.clone(),
            total_supply,
            creator: creator.clone(),
            created_at: timestamp,
        };
        
        // Store token information
        env.storage().instance().set(&TokenBook::Token(token_count), &token_info);
        env.storage().instance().set(&TOKEN_COUNTER, &token_count);
        
        // Update total tokens count
        let mut total: u64 = env.storage().instance().get(&TOTAL_TOKENS).unwrap_or(0);
        total += 1;
        env.storage().instance().set(&TOTAL_TOKENS, &total);
        
        // Extend storage TTL
        env.storage().instance().extend_ttl(5000, 5000);
        
        log!(&env, "Token created successfully with ID: {}", token_count);
        token_count
    }
    
    /// Retrieves token information by token_id
    pub fn get_token_info(env: Env, token_id: u64) -> TokenInfo {
        let key = TokenBook::Token(token_id);
        
        env.storage().instance().get(&key).unwrap_or(TokenInfo {
            token_id: 0,
            name: String::from_str(&env, "Not_Found"),
            symbol: String::from_str(&env, "N/A"),
            total_supply: 0,
            creator: Address::from_string(&String::from_str(&env, "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF")),
            created_at: 0,
        })
    }
    
    /// Returns the total number of tokens created
    pub fn get_total_tokens(env: Env) -> u64 {
        env.storage().instance().get(&TOTAL_TOKENS).unwrap_or(0)
    }
    
    /// Updates the total supply of an existing token (only by creator)
    pub fn update_supply(
        env: Env,
        token_id: u64,
        creator: Address,
        new_supply: i128
    ) {
        // Verify the creator is authorized
        creator.require_auth();
        
        // Validate new supply
        if new_supply <= 0 {
            log!(&env, "New supply must be greater than 0");
            panic!("Invalid supply amount");
        }
        
        // Get existing token info
        let mut token_info = Self::get_token_info(env.clone(), token_id);
        
        // Verify caller is the original creator
        if token_info.creator != creator {
            log!(&env, "Only token creator can update supply");
            panic!("Unauthorized");
        }
        
        // Check if token exists
        if token_info.token_id == 0 {
            log!(&env, "Token not found");
            panic!("Token does not exist");
        }
        
        // Update supply
        token_info.total_supply = new_supply;
        
        // Store updated token info
        env.storage().instance().set(&TokenBook::Token(token_id), &token_info);
        env.storage().instance().extend_ttl(5000, 5000);
        
        log!(&env, "Token supply updated for ID: {}", token_id);
    }
}