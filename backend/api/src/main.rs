mod handlers;
mod models;
mod routes;
mod handle_auth;


struct RGBColor {
    r: u8,
    g: u8,
    b: u8,
}

struct Tag<T> {
    key: String,
    value: T,
}


#[tokio::main]
async fn main() {

    let colorTag = Tag::<RGBColor> {
        key: "color".to_string(),
        value: RGBColor { r: 255, g: 0, b: 0 },
    };

    let routes = crate::routes::routes();
    println!("Server started at http://localhost:8321");
    warp::serve(routes).run(([127, 0, 0, 1], 8321)).await;
}
