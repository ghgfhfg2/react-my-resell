import React from "react";
import { useHistory } from "react-router-dom";
import firebase from "../firebase";
import { Button, PageHeader } from "antd";
import * as fcIcon from "react-icons/fc";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../redux/actions/user_action";

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
        history.push("/");
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
      {/* <PageHeader
        className="title_box"
        onBack={() => history.goBack()}
        title="Login"
      /> */}
      <div className="login_box">
        <Button className="flex_box" onClick={joinToGoogle}>
          <fcIcon.FcGoogle
            style={{
              position: "relative",
              top: "2px",
              fontSize: "16px",
              marginRight: "8px",
            }}
          />
          google로 로그인하기
        </Button>
      </div>
    </>
  );
}

export default Login;
