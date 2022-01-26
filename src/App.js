import React, { useState, useEffect } from "react";
import { Route, Switch, useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./redux/actions/user_action";
import firebase from "./firebase";
import * as antIcon from "react-icons/ai";
import "./custom_antd.less";
import "./App.css";
import Login from "./component/Login";
import Nav from "./component/Nav";
import Buy from "./component/Buy";

function App() {
  const userInfo = useSelector((state) => state.user.currentUser);
  let history = useHistory();
  let dispatch = useDispatch();
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        history.push("/login");
        dispatch(clearUser());
      }
    });
  }, []);

  const onLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("successful logout");
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const [total, setTotal] = useState(false);
  const onTotal = () => {
    setTotal(!total);
  };

  return (
    <>
      <div className="wrapper">
        <header className="header">
          {userInfo && (
            <button
              type="button"
              className={total ? `total_menu on` : `total_menu`}
              onClick={onTotal}
            >
              <span className="line top"></span>
              <span className="line mid"></span>
              <span className="line bot"></span>
            </button>
          )}
          <Nav onTotal={onTotal} total={total} onLogout={onLogout} />
        </header>
        <section className="content_box">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/buy" component={Buy} />
          </Switch>
        </section>
      </div>
    </>
  );
}

export default App;
