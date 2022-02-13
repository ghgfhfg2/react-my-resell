import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as fiIcon from "react-icons/fi";

function Nav({ onTotal, total, onLogout }) {
  const userInfo = useSelector((state) => state.user.currentUser);

  return (
    <>
      {userInfo && (
        <nav className={total ? `nav_wrap on` : `nav_wrap`}>
          <div className="top">
            <span>{userInfo.displayName}</span>
            <fiIcon.FiLogOut
              onClick={onLogout}
              style={{
                fontSize: "1rem",
                position: "relative",
                top: "1px",
                marginLeft: "10px",
                cursor: "pointer",
              }}
            />
          </div>
          <ul className="menu">
            <li className="ani_1">
              <Link to="/" onClick={onTotal}>
                목록
              </Link>
            </li>
            <li className="ani_2">
              <Link to="/admin" onClick={onTotal}>
                카테고리등록
              </Link>
            </li>
            <li className="ani_3">
              <Link to="/buy" onClick={onTotal}>
                구매등록
              </Link>
            </li>
            <li className="ani_4">
              <Link to="/info" onClick={onTotal}>
                수익
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}

export default Nav;
