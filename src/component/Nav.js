import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as fiIcon from "react-icons/fi";

function Nav({ onTotal, total, onLogout }) {
  const userInfo = useSelector((state) => state.user.currentUser);
  const nav = useRef([]);
  if (nav) {
    nav.current.map((el, idx) => {
      el.classList.add(`ani_${idx}`);
    });
  }

  return (
    <>
      <nav className={total ? `nav_wrap on` : `nav_wrap`}>
        {userInfo && (
          <>
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
              <li ref={(el) => (nav.current[1] = el)}>
                <Link to="/list" onClick={onTotal}>
                  목록
                </Link>
              </li>
              <li ref={(el) => (nav.current[2] = el)}>
                <Link to="/admin" onClick={onTotal}>
                  설정
                </Link>
              </li>
              <li ref={(el) => (nav.current[3] = el)}>
                <Link to="/buy" onClick={onTotal}>
                  구매등록
                </Link>
              </li>
              <li ref={(el) => (nav.current[4] = el)}>
                <Link to="/info" onClick={onTotal}>
                  내역
                </Link>
              </li>
            </ul>
          </>
        )}
      </nav>
    </>
  );
}

export default Nav;
