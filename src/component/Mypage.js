import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import firebase from "../firebase";
import { clearUser } from "../redux/actions/user_action";
import * as fiIcon from "react-icons/fi";

function Mypage() {
  let history = useHistory();
  let dispatch = useDispatch();
  const onLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(clearUser());
        history.push("/login");
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };
  const userInfo = useSelector((state) => state.user.currentUser);
  return (
    <>
      {userInfo && (
        <div className="mypage">
          <div className="profile">
            {userInfo.displayName}
            <button type="button" className="btn_logout" onClick={onLogout}>
              <fiIcon.FiLogOut />
              로그아웃
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Mypage;
