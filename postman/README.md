# Postman Collection

This folder contains a Postman collection for smoke-testing the static pages and CSS assets in this project.

## Files

- `Zeayd-s-project.postman_collection.json` — imports into Postman and includes grouped requests for pages, stylesheets, and themes.

## How to use

1. Start a static web server from the repository root. For example:

   ```bash
   python3 -m http.server 5500
   ```

2. Import `postman/Zeayd-s-project.postman_collection.json` into Postman.
3. Confirm the collection variable `baseUrl` is set to your running site URL, such as `http://localhost:5500`.
4. Run the collection in Postman Collection Runner.

The collection includes tests that verify each request returns HTTP 200 and checks for expected content in the returned HTML or CSS.
