import React, { useState, useEffect } from "react";
import { Route, Switch, useHistory, Link, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./redux/actions/user_action";
import firebase from "./firebase";
import "./custom_antd.less";
import "./App.css";
import Login from "./component/Login";
import Nav from "./component/Nav";
import Buy from "./component/Buy";
import Admin from "./component/Admin";
import List from "./component/List";
import Info from "./component/Info";
import Join from "./component/Join";
import { ReactComponent as Logo } from "./img/logo.svg";
import Footer from "./component/Footer";

function App({ location }) {
  let deferredInstallPrompt = null;

  window.addEventListener("beforeinstallprompt", (e) => {
    deferredInstallPrompt = e;
    console.log("'beforeinstallprompt' event was fired.");
  });

  function userClickedAddToHome() {
    deferredInstallPrompt.prompt();

    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        // 유저가 홈 스크린에 어플리케이션 추가에 동의
      } else {
        // 유저가 홈 스크린에 어플리케이션 추가를 거부
      }
      deferredInstallPrompt = null;
    });
  }

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
  const closeTotal = () => {
    setTotal(false);
  };

  useEffect(() => {
    closeTotal();
  }, [location]);

  return (
    <>
      <div className="wrapper">
        {userInfo && (
          <header className="header">
            <figure className="logo">
              <Link to="/">
                <Logo />
              </Link>
            </figure>
            <button
              type="button"
              className={total ? `total_menu on` : `total_menu`}
              onClick={onTotal}
            >
              <span className="line top"></span>
              <span className="line mid"></span>
              <span className="line bot"></span>
            </button>
          </header>
        )}
        <Nav onTotal={onTotal} total={total} onLogout={onLogout} />
        <Switch>
          <>
            <Route exact path="/login" component={Login} />
            <section className="content_box">
              <Route exact path="/" component={List} />
              <Route exact path="/join" component={Join} />
              <Route exact path="/buy" component={Buy} />
              <Route exact path="/admin" component={Admin} />
              <Route exact path="/info" component={Info} />
            </section>
          </>
        </Switch>
        {userInfo && <Footer />}
        {/* {userInfo && (
          <Link to="/buy" className="btn_buy">
            <biIcon.BiListPlus />
          </Link>
        )} */}
      </div>
    </>
  );
}

export default withRouter(App);
