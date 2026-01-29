use crate::models::{LoginRequest, LoginResonse, ProfileResponse};
use hmac::{Hmac, Mac};
use jwt::SignWithKey;
use sha2::Sha256;
use std::collections::BTreeMap;

pub async fn post_login(data: LoginRequest) -> Result<impl warp::Reply, warp::Rejection> {
    if !(data.name_or_email.eq("test") && data.password.eq("asb123")) {
        return Ok(warp::reply::json(&LoginResonse {
            token: "".to_string(),
            error: Some("Invalid username or password".to_string()),
        }));
    }

    let key: Hmac<Sha256> = Hmac::new_from_slice(b"some-secret").unwrap();
    let mut claims = BTreeMap::new();
    claims.insert("usr", data.name_or_email);
    let token_str = claims.sign_with_key(&key).unwrap();

    let post = LoginResonse {
        token: token_str,
        error: None,
    };
    Ok(warp::reply::json(&post))
}

pub async fn get_profile(profile_id: String) -> Result<impl warp::Reply, warp::Rejection> {
    let post = ProfileResponse {
        name: "Sebu".to_string(),
        tags: "Not implemented lol yet!".to_string(),
    };
    Ok(warp::reply::json(&post))
}
