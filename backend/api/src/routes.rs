use std::convert::Infallible;

use warp::{Filter};

use crate::{handle_auth::{handle_rejection, with_auth}, models};

use super::handlers;


// A function to build our routes
pub fn routes() -> impl Filter<Extract = impl warp::Reply, Error = Infallible> + Clone {

    let auth = with_auth();

    let login_post = warp::path!("login")
        .and(warp::post())
        .and(json_body())
        .and_then(handlers::post_login);

    let get_profile = warp::path!("profile" / String)
        .and(warp::get())
        .and(auth)
        .and_then(|profile_id: String, user_id: String| handlers::get_profile(profile_id));

    login_post.or(get_profile).recover(handle_rejection)
}

fn json_body() -> impl Filter<Extract = (models::LoginRequest,), Error = warp::Rejection> + Clone {
    warp::body::content_length_limit(1024 * 16).and(warp::body::json())
}


