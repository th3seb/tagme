use crate::{ models::{LoginRequest, LoginResonse, ProfileResponse}};
use crate::handle_auth::create_jwt;

pub async fn post_login(data: LoginRequest) -> Result<impl warp::Reply, warp::Rejection> {
    if !(data.name_or_email.eq("test") && data.password.eq("asb123")) {
        return Ok(warp::reply::json(&LoginResonse {
            token: "".to_string(),
            error: Some("Invalid username or password".to_string()),
        }));
    }

    let token_str = match create_jwt(data).await {
        Ok(token) => token,
        Err(_e) => {
            return Ok(warp::reply::json(&LoginResonse {
                token: "".to_string(),
                error: Some("Failed to create token".to_string()),
            }));
        }
    };

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
