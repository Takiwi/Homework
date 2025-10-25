# Tuần 1: 25/10 - ?/?

- Thực sự thì các câu trả lời trong đây không phải là 100% là tự trả lời mà có tham khao IA, dù sao cũng coi như là tự tìm hiểu thêm để sau này tự tin đi phỏng vấn.
  > Fuck You

## Phần 1: lý thuyết

1. **Giải thích vòng đời của một request trong Express.**
   - Vòng đời của 1 request như sau:
     - Client truy cập vào 1 URL nào đó hoặc submit 1 cái gì đó thì 1 request sẽ được tạo ra từng hành động đó của client. Request đó sẽ chứa URL, HTTP method, headers, body.
     - Khi request đã được tạo ra thì nó được DNS đọc URL và chuyển sang dạng IP, trình duyệt sẽ mở TCP connection, hoặc LST handshake, sau đó nó nó sẻ gửi đi qua Internet đến server.
     - Web server sẽ nhận được request và chuyển đến ứng dụng tương ứng.
     - Lúc này Application có trên server sẽ nhận và xử lý request đó như kiểm tra request có hợp lệ không, request đó cần những gì, đang gọi đến endpoint nào, ...
     - Khi Application xử lý xong thì sẽ đóng gói vả trả ngược lại **Response** cho client như status code, headers, body, trình duyệt sẽ nhận và xử lý **Response** như render lại trang trang, ...
     - Cuối cùng thì kết nối TCP có thể được giữ lại cho request tiếp theo hoặc đóng lại nếu éo cần nữa.

---

2. **Middleware là gì? Phân biệt middleware thông thường và error-handling middleware.**

- Middleware là 1 lớp trung gian xử lý logic chung, có nhiệm vụ xử lý request/response trước khi đến hoặc rời controller.

- Để phân biệt middleware thường và middleware error thì ngoài số lượng tham số đầu vào thì tôi nhớ không lầm là middleware là được gọi theo thứ tự còn với middleware error thì chỉ được gọi hay xử lý khi phát hiện có lỗi trong server và nó sẽ bỏ qua các middleware khác thường thì nó nằm cuối cùng của luồng chắc vậy.

---

3. **Tại sao cần next()? Điều gì xảy ra nếu quên gọi next() trong middleware?**

- Cần gọi để đẩy request sang các middleware khác để xử lý, nếu quên gọi next() thì request sẽ bị treo và nothing happened, cũng có thể bị request timeout.

---

4. **Giải thích cơ chế bất đồng bộ của Node.js — tại sao không cần tạo thread mới cho mỗi request?**

- Đơn giản là xử lý song song nhiều thao tác gây tốn giời gian mà không chặn lại.
- (**Đang tìm hiểu thêm**)

---

5. **Sự khác nhau giữa res.send() và res.json() là gì?**

- res.send() thì nó sẽ đoán kiểu của thứ mà chuyền vào ví dụ: res.send("Hello bro") -> trả về 1 chuỗi, res.send(`"<h1> Hello bro</h1>"`) -> trả về thẻ h1, ... Còn với res.json() thì luôn trả về 1 JSON.

---

6. **Tác dụng của app.use(express.json())?**

- Đây là đang khai báo app của chúng ta sẽ sử dụng 1 middleware có khả năng giải tự phân tích body của request có định dạng JSON rồi gắn kết quả vào req.body.

---

7. **Khi nào nên tách router thành file riêng?**

- Ờ thì tùy thôi nếu dự án nhỏ thì bạn thích thì nhét hết vào 1 file còn nếu dự án to hơn thì nên tách ra nhiều file router theo chắc năng khác nhau để dể quản lý và mở rộng thôi.
- ├── routes/  
  ├── auth.routes.js  
  └── task.routes.js

---

8. **Giải thích req.params, req.query, req.body khác nhau thế nào.**

- req.params: dùng khi định nghĩa biến trong URL.
  - Ví dụ: /post/:id ->/post/10
- req.query: dùng khi muốn gửi dữ liệu nhẹ.
  - Ví dụ: GET /search?keyword=code&page=2 -> `req.query = { keyword: "nodejs", page: "2" } `
- req.body: dùng khi muốn gửi các dữ liệu phức tạp.
  - Ví dụ: client có thể gửi JSON

---

9. **JWT gồm 3 phần gì? Làm sao để xác thực request bằng JWT trong Express?**

- (**Đang nghiên cứu thêm**)

---

10. **Trong một hệ thống lớn, logging nên thực hiện ở đâu và bằng công cụ nào (ví dụ)?**

- (**Đang nghiên cứu thêm**)

## Phần 2:
