import React from "react";
import { useHistory, Link } from "react-router-dom";
import firebase from "../firebase";
import { Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/actions/user_action";
import { ReactComponent as Logo } from "../img/logo.svg";
import "../font.css";

function Login() {
  let history = useHistory();
  let dispatch = useDispatch();
  const onFinish = (values) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then((userCredential) => {
        // Signed in
        let user = userCredential.user;
        message.success(`${user.displayName}님 반갑습니다 :)`);
        dispatch(setUser(user));
        history.push("/");
      })
      .catch((error) => {
        let errorCode = error.code;
        if (errorCode === "auth/invalid-email") {
          message.error("이메일 형식이 맞지 않습니다.");
        }
        if (errorCode === "auth/wrong-password") {
          message.error("비밀번호가 맞지 않습니다.");
        }
      });
  };
  return (
    <>
      <div className="login_box">
        <span className="tit font_gow">나의 리셀 장부</span>
        <figure className="logo">
          <Logo />
        </figure>
        <div className="form_box">
          <Form
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "이메일 입력해 주세요" }]}
            >
              <Input size="large" placeholder="이메일" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "비밀번호를 입력해 주세요" }]}
            >
              <Input.Password size="large" placeholder="비밀번호" />
            </Form.Item>
            <Form.Item style={{ marginBlock: "10px" }}>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                로그인
              </Button>
            </Form.Item>
          </Form>
          <Link to="/join" className="btn_join">
            회원가입
          </Link>
        </div>
        <span className="copy">Copyrightⓒ2022 sooya_dev</span>
      </div>
    </>
  );
}

export default Login;
