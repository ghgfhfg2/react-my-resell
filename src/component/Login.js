import React from "react";
import { useHistory } from "react-router-dom";
import firebase from "../firebase";
import { Button } from "antd";
import * as fcIcon from "react-icons/fc";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/actions/user_action";
import { ReactComponent as Logo } from "../img/logo.svg";
import "../font.css";

function Login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  let history = useHistory();
  let dispatch = useDispatch();
  const joinToGoogle = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        let credential = result.credential;
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = credential.accessToken;
        // The signed-in user info.
        let user = result.user;
        dispatch(setUser(user));
        history.push("/list");
      })
      .catch((error) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // The email of the user's account used.
        let email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential;
        // ...
      });
  };
  return (
    <>
      <div className="login_box">
        <span className="tit font_gow">나의 리셀 장부</span>
        <figure className="logo">
          <Logo />
        </figure>
        <Button className="flex_box btn_login" onClick={joinToGoogle}>
          <fcIcon.FcGoogle
            style={{
              position: "relative",
              top: "2px",
              fontSize: "16px",
              marginRight: "8px",
            }}
          />
          google 로그인
        </Button>
        <span className="copy">Copyrightⓒ2022 sooya_dev</span>
      </div>
    </>
  );
}

export default Login;
