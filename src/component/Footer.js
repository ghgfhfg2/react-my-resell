import React from "react";
import { Link, withRouter } from "react-router-dom";
import * as aiIcon from "react-icons/ai";
import { RiFileUserLine, RiFileUserFill } from "react-icons/ri";

function Footer({ location }) {
  const path = location.pathname;
  return (
    <footer className="footer_menu">
      <Link to="/" className={path === "/" ? "on" : ""}>
        {path === "/" ? <aiIcon.AiFillTags /> : <aiIcon.AiOutlineTags />}
        <span>상품</span>
      </Link>
      <Link to="/admin" className={path === "/admin" ? "on" : ""}>
        {path === "/admin" ? (
          <aiIcon.AiFillDatabase />
        ) : (
          <aiIcon.AiOutlineDatabase />
        )}
        <span>카테고리</span>
      </Link>
      <Link to="/buy" className={path === "/buy" ? "on" : ""}>
        {path === "/buy" ? (
          <aiIcon.AiFillFileAdd />
        ) : (
          <aiIcon.AiOutlineFileAdd />
        )}
        <span>등록</span>
      </Link>
      <Link to="/info" className={path === "/info" ? "on" : ""}>
        {path === "/info" ? <aiIcon.AiFillFund /> : <aiIcon.AiOutlineFund />}
        <span>수익</span>
      </Link>
      <Link to="/mypage" className={path === "/mypage" ? "on" : ""}>
        {path === "/mypage" ? <RiFileUserFill /> : <RiFileUserLine />}
        <span>마이페이지</span>
      </Link>
    </footer>
  );
}

export default withRouter(Footer);
