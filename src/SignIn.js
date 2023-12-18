import "./App.css";
import React, { useState, Fragment, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignIn() {
  const apiUrl = "https://localhost:7257/";

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Sayfa yenilendiğinde localStorage'dan hatırla beni seçeneğini kontrol et
    const storedRememberMe = localStorage.getItem("rememberMe");
    if (storedRememberMe === "true") {
      setRememberMe(true);
      // Kullanıcı adı ve şifreyi localStorage'dan al
      const storedUsername = localStorage.getItem("username");
      const storedPassword = localStorage.getItem("password");
      if (storedUsername && storedPassword) {
        setUsername(storedUsername);
        setPassword(storedPassword);
      }
    }
  }, []);


  function submitForm() {
    const postData = {
      email: username,
      password: password,
    };

    fetch(apiUrl + "Identity/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData?.status !== 401) {
          localStorage.setItem(
            "userToken",
            responseData.tokenType + " " + responseData.accessToken
          );

          if (rememberMe) {
            // cryptojs kullanarak şifrelenebilir
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            localStorage.setItem("rememberMe", true);
          } else {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
            localStorage.setItem("rememberMe", false);
          }

          navigate("/telephoneDirectory");
        } else {
          toast.error("Kullanıcı bilgileri hatalı");
        }
      })
      .catch((error) => console.error("işlem başarısız", error));
  }

  return (
    <Fragment>
      <div className="App">
        <ToastContainer />
        <header className="App-header">
          <div className="app-title">
            <h1 className="title-text">ORIONPOS TELEFON REHBERİ</h1>
          </div>
          <div className="App-form">
            <Form>
              <div className="form-group">
                <Form.Label>Email Adresi</Form.Label>
                <Form.Control
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  name="username"
                  value={username}
                  required
                />
              </div>

              <div className="form-group">
                <Form.Label>Şifre</Form.Label>
                <Form.Control
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  value={password}
                  required
                />
              </div>

              <div className="form-group">
                <Form.Label>
                  Beni Hatırla{" "}
                  <input
                    type="checkbox"
                    name="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </Form.Label>
              </div>

              <div className="form-group">
                <input type="button" className="btn btn-success" onClick={submitForm} value="Log - In" />
              </div>
            </Form>
          </div>
        </header>
      </div>
    </Fragment>
  );
}

export default SignIn;
