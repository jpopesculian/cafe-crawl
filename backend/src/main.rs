#[macro_use]
extern crate serde;
#[macro_use]
extern crate log;
#[macro_use]
extern crate thiserror;
extern crate simple_logger;

use hmac::{Hmac, NewMac};
use jwt::{SignWithKey, VerifyWithKey};
use lambda_runtime::{handler_fn, Context};
use rusoto_core::Region;
use rusoto_dynamodb::{AttributeValue, DynamoDb, DynamoDbClient, GetItemInput, PutItemInput};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::env;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

type Error = Box<dyn std::error::Error + Send + Sync + 'static>;

#[derive(Deserialize, Clone)]
#[serde(rename_all = "snake_case")]
#[serde(tag = "event")]
enum Request {
    Login { password: String },
    Update { token: String, value: f32 },
    Read,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "snake_case")]
#[serde(tag = "event")]
enum Response {
    LoginSucceeded { token: String },
    LoginFailed,
    Unauthorized,
    ValueUpdated { value: f32 },
    ValueRead { value: f32 },
}

#[derive(Clone, Debug, Error)]
enum HandlerError {
    #[error("Invalid JWT secret: {:?}", _0)]
    InvalidJwtSecret(hmac::crypto_mac::InvalidKeyLength),
    #[error("DynamoDB item not found")]
    DynamoDBItemNotFound,
    #[error("DynamoDB attribute not found")]
    DynamoDBAttributeNotFound,
    #[error("DynamoDB attribute invalid")]
    DynamoDBAttributeInvalid,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    simple_logger::init_with_level(log::Level::Info)?;
    lambda_runtime::run(handler_fn(my_handler)).await?;
    Ok(())
}

fn check_pass(password: &str) -> Result<bool, Error> {
    let pass_digest = Sha256::digest(password.as_bytes());
    let pass_hash = hex::decode(env::var("PASSWORD_HASH")?)?;
    Ok(pass_hash.as_slice() == pass_digest.as_slice())
}

fn jwt_key() -> Result<Hmac<Sha256>, Error> {
    let secret = env::var("JWT_SECRET")?;
    Ok(Hmac::new_from_slice(secret.as_bytes()).map_err(HandlerError::InvalidJwtSecret)?)
}

fn issue_jwt() -> Result<jwt::Token<jwt::Header, jwt::Claims, jwt::token::Signed>, Error> {
    let header = jwt::Header {
        algorithm: jwt::AlgorithmType::Hs256,
        ..Default::default()
    };
    let claims = jwt::Claims::new(jwt::RegisteredClaims {
        expiration: Some(
            (SystemTime::now() + Duration::from_secs(86_400))
                .duration_since(UNIX_EPOCH)?
                .as_secs(),
        ),
        ..Default::default()
    });
    Ok(jwt::Token::new(header, claims).sign_with_key(&jwt_key()?)?)
}

fn check_jwt(
    token: jwt::Token<jwt::Header, jwt::Claims, jwt::token::Unverified>,
) -> Result<bool, Error> {
    let token = token.verify_with_key(&jwt_key()?)?;
    let valid = if let Some(expiration_date) = token.claims().registered.expiration {
        (UNIX_EPOCH + Duration::from_secs(expiration_date)) > SystemTime::now()
    } else {
        false
    };
    Ok(valid)
}

async fn update_value(value: f32) -> Result<(), Error> {
    let client = DynamoDbClient::new(Region::EuCentral1);
    let mut item = HashMap::new();
    item.insert(
        "id".into(),
        AttributeValue {
            s: Some("main".into()),
            ..Default::default()
        },
    );
    item.insert(
        "value".into(),
        AttributeValue {
            n: Some(value.to_string()),
            ..Default::default()
        },
    );
    client
        .put_item(PutItemInput {
            table_name: "cafe-crawl-table".into(),
            item,
            ..Default::default()
        })
        .await?;
    Ok(())
}

async fn get_value() -> Result<f32, Error> {
    let client = DynamoDbClient::new(Region::EuCentral1);
    let mut key = HashMap::new();
    key.insert(
        "id".into(),
        AttributeValue {
            s: Some("main".into()),
            ..Default::default()
        },
    );
    let out = client
        .get_item(GetItemInput {
            table_name: "cafe-crawl-table".into(),
            key,
            ..Default::default()
        })
        .await?;
    let value = out
        .item
        .ok_or(HandlerError::DynamoDBItemNotFound)?
        .get("value")
        .ok_or(HandlerError::DynamoDBAttributeNotFound)?
        .n
        .as_ref()
        .ok_or(HandlerError::DynamoDBAttributeInvalid)?
        .parse()?;
    Ok(value)
}

async fn my_handler(req: Request, _ctx: Context) -> Result<Response, Error> {
    match req {
        Request::Read => Ok(Response::ValueRead {
            value: get_value().await?,
        }),
        Request::Login { password } => {
            info!("Login request");
            if check_pass(&password)? {
                info!("Login successful");
                Ok(Response::LoginSucceeded {
                    token: issue_jwt()?.into(),
                })
            } else {
                info!("Unauthorized login");
                Ok(Response::LoginFailed)
            }
        }
        Request::Update { token, value } => {
            info!("Update request [value={}]", value);
            if check_jwt(jwt::Token::parse_unverified(&token)?)? {
                update_value(value).await?;
                info!("Update successful [value={}]", value);
                Ok(Response::ValueUpdated { value })
            } else {
                info!("Unauthorized update");
                Ok(Response::Unauthorized)
            }
        }
    }
}
