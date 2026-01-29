use warp::Filter;

use crate::models;

use super::handlers;

// A function to build our routes
pub fn routes() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    let login_post = warp::path!("login")
        .and(warp::post())
        .and(json_body())
        .and_then(handlers::post_loing);

    let get_profile = warp::path!("profile" / String)
        .and(warp::get())
        .and_then(handlers::get_profile);

    login_post.or(get_profile)
}

fn json_body() -> impl Filter<Extract = (models::LoginRequest,), Error = warp::Rejection> + Clone {
    warp::body::content_length_limit(1024 * 16).and(warp::body::json())
}
