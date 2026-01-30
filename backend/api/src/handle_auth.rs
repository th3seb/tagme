
use hmac::{Hmac, Mac};
use sha2::Sha256;
use jwt::{VerifyWithKey, SignWithKey};
use warp::{reject::Rejection, reply::Reply, http::StatusCode, Filter};

use dotenv::dotenv;
use std::{env, collections::BTreeMap, env::VarError};

use crate::models::{LoginRequest, Unauthorized, ErrorMessage};

async fn get_secret() -> Result<String, VarError> {
    dotenv().ok();
    
    let secret = env::var("SECRET");

    return secret;
}


pub fn with_auth() -> impl Filter<Extract = (String,), Error = warp::Rejection> + Clone {
    warp::header::<String>("authorization")
        .and_then(move |token: String| {
            async move {
                match verify_jwt(token).await {
                    Ok(user_id) => Ok(user_id),
                    Err(_) => Err(warp::reject::custom(Unauthorized)),
                }
            }
        })
}

pub async fn verify_jwt(token: String) -> Result<String, warp::Rejection> {
    
    let secret = match get_secret().await {
        Ok(s) => s,
        Err(_) => return Err(warp::reject::reject()),
    };

    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes())
        .map_err(|_| warp::reject::reject())?;

    let claims: BTreeMap<String, String> = token
        .verify_with_key(&key)
        .map_err(|_| warp::reject::reject())?;

    Ok(format!("Willkommen, {}", claims.get("user").unwrap_or(&"Unbekannt".to_string())))
}

pub async fn create_jwt(data:LoginRequest) -> Result<String, warp::Rejection> {

    let secret = match get_secret().await {
        Ok(s) => s,
        Err(_) => return Err(warp::reject::reject()),
    };

    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes())
        .map_err(|_| warp::reject::reject())?;
    let mut claims = BTreeMap::new();
    claims.insert("usr", data.name_or_email);
    let token_str = claims.sign_with_key(&key).unwrap();

    Ok(token_str)

}

pub async fn handle_rejection(err: Rejection) -> Result<impl Reply, std::convert::Infallible> {
    let code;
    let message;


    if err.is_not_found() {
        code = StatusCode::NOT_FOUND;
        message = "Route nicht gefunden";
    } else if let Some(_) = err.find::<Unauthorized>() {
        code = StatusCode::UNAUTHORIZED;
        message = "Ungültiges Token oder nicht autorisiert";
    } else {
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = "Ein interner Fehler ist aufgetreten";
    }

    let json = warp::reply::json(&ErrorMessage {
        message: message.into(),
    });

    Ok(warp::reply::with_status(json, code))
}