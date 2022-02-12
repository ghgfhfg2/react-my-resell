import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
  AiOutlineOrderedList,
  AiOutlineDatabase,
  AiOutlineAppstoreAdd,
  AiOutlineBarChart,
} from "react-icons/ai";

function Footer({ location }) {
  const path = location.pathname;
  return (
    <footer className="footer_menu">
      <Link to="/" className={path === "/" ? "on" : ""}>
        <AiOutlineOrderedList />
        <span>상품</span>
      </Link>
      <Link to="/admin" className={path === "/admin" ? "on" : ""}>
        <AiOutlineDatabase />
        <span>카테고리</span>
      </Link>
      <Link to="/buy" className={path === "/buy" ? "on" : ""}>
        <AiOutlineAppstoreAdd />
        <span>등록</span>
      </Link>
      <Link to="/info" className={path === "/info" ? "on" : ""}>
        <AiOutlineBarChart />
        <span>수익</span>
      </Link>
    </footer>
  );
}

export default withRouter(Footer);
