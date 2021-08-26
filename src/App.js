import React, { useState, useEffect } from "react";
import { Route, Switch, useHistory, Link } from "react-router-dom";
import { Layout, Menu } from 'antd';
import * as antIcon from "react-icons/ai";
//import firebase from './firebase';
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./redux/actions/user_action";

import './custom_antd.less';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function App() {
  /*
  const firebaseUserInfo = firebase.auth().currentUser;
  useEffect(() => {
    
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
        .database()
        .ref("users")
        .child(user.uid)
        .once("value", (snapshot) => {
          let addInfo = {
            ...user,
            auth:snapshot.val().auth,
            call_number:snapshot.val().call_number,
            favorite:snapshot.val().favorite,
            role:snapshot.val().role,
            sosok:snapshot.val().sosok,
          }
          history.push("/");
          dispatch(setUser(addInfo));
        });
      } else {
        history.push("/login");
        dispatch(clearUser());
      }
    });
    
  }, []);  
  */
  return (
    <>
      <Layout className="layout">
        <Header>
          {/* <div className="content-box">
            <div className="flex-box nav-top-box">
              {!currentUser ? (
                <>
                  <Link to="/login" style={{marginRight:"10px"}}>
                    login
                  </Link>
                  <Link to="/join">
                    join
                  </Link>
                </>
              ):(
                <>
                  <div className="log-in">
                    <span style={{color:"#fff"}}>
                      {currentUser.displayName}님 반갑습니다.
                    </span>
                    <span
                      onClick={onLogout}
                      className="p-color-l"
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    >
                      logout
                    </span>
                  </div>
                </>
              )}
            </div>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            </Menu>
          </div> */}
        </Header> 
        <Content className="content-box layout">
          {/*
          <Switch>
             <Route exact path="/" component={Main} />
          </Switch>
           */}
        </Content>
      </Layout>
    </>
  );
}

export default App;
