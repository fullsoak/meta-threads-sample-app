# meta-threads-sample-app

![example web app built on FullSoak](https://khangdinh.wordpress.com/wp-content/uploads/2025/04/fullsoak-example-web-app-meta-threads-1.png)

# English

This is a kitchen sink example codebase for a small-sized web app building on
top of [FullSoak web framework](https://fullsoak.dev).

This repo demonstrates the following:

- setting up and running a nobuild TypeScript full stack web app (on
  [Deno](https://deno.com) runtime)
- making API calls to
  [Meta (Facebook) Threads platform](https://developers.facebook.com/docs/threads/)

As this is a demo example, it's not meant to be full-fledged or even at
production-quality. Below are some top-of-mind features and how well-supported
they are:

- [x] making calls to the `/mentions` and `/reply_to_id` Threads APIs
- [ ] making calls to other Threads APIs
- [ ] serving static assets from the `public` directory (workaround: use NginX
      or CDN, also as recommended on PROD)
- [ ] using a more scalable database approach than `node:sqlite`'s
      `DatabaseSync`
- [ ] test cases
- [ ] cleaned up examples for using the
      [Shoelace UI library](https://shoelace.style/)

# Vietnamese

Đây là mã nguồn ví dụ, sử dụng [web framework FullSoak](https://fullsoak.dev) để
xây dựng một web app cỡ nhỏ.

Mã nguồn này thí điểm những tác vụ sau:

- thiết lập và chạy một web app trên nền runtime [Deno](https://deno.com) mà
  không cần thông qua các bước cấu hình phức tạp (code xong chạy ngay)
- gọi API đến máy chủ của Meta để tương tác với
  [API của mạng xã hội Threads](https://developers.facebook.com/docs/threads/)

Vì đây là mã nguồn thí điểm, chúng ta không nhằm mục đích làm cho nó hoàn thiện
hay hoàn hảo, thậm chí nó có thể không phù hợp chạy thật trên môi trường
production. Dưới đây là các hạn mục tiêu biểu và hiện trạng của chúng:

- [x] gọi đến các Threads API: `/mentions` và `/reply_to_id`
- [ ] gọi đến các Threads API khác
- [ ] serve các tập tin từ thư mục `public` (thay vào đó ta có thể dùng NginX
      hay CDN, và đây cũng là cách được khuyến cáo ở môi trường production)
- [ ] tương tác với CSDL qua các API phù hợp sử dụng đa luồn hơn thay vì dùng
      `DatabaseSync` của `node:sqlite`
- [ ] code kiểm thử (test cases)
- [ ] cải thiện ví dụ sử dụng [thư viện UI Shoelace](https://shoelace.style/)

# Quickstart

1. Prepare a Meta Threads App:
   https://developers.facebook.com/docs/threads/get-started

2. Prepare an `.env` file (see `.env.sample` for details)

3. Install Deno: https://docs.deno.com/runtime/getting_started/installation/

4. Run CLI command:

   ```bash
   deno task dev
   ```

5. The app should start up on the default (hardcoded) port:
   `http://localhost:6969`

6. Use a service (e.g. ngrok) or any similar tool to expose the app (on your
   localhost) to the internet. Make sure the domain matches exactly the value
   declared in the `.env` file from step (2) above
