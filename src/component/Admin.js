import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useSelector } from "react-redux";
import firebase from "../firebase";
import uuid from "react-uuid";
import * as mdIcon from "react-icons/md"
import * as riIcon from "react-icons/ri"

function Admin() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const db = firebase.database();

  const [category, setCategory] = useState();
  useEffect(() => {
    userInfo && 
    db.ref(`category/${userInfo.uid}`).on("value", (data) => {
      let arr = [];
      data.forEach((el) => {
        arr.push(el.val());
      });
      setCategory(arr);
    });
    return () => {
      userInfo && db.ref(`category/${userInfo.uid}`).off();
    };
  }, [userInfo]);

  const onFinish = (values) => {
    const uid = uuid();
    db.ref(`category/${userInfo.uid}/${uid}`).update({
      uid,
      name: values.category_name,
    });
    console.log("Success:", values);
  };

  const onCateDel = (uid,uid2) => {
    db.ref(`prod_list/${userInfo.uid}`).orderByChild('prod_cate').equalTo(uid).once('value',data=>{
      data.forEach(el=>{
        db.ref(`prod_list/${userInfo.uid}/${el.key}`).remove();
      })
    })
    db.ref(`category/${userInfo.uid}/${uid2}`).remove();
  }

  return (
    <>
      <Form onFinish={onFinish} style={{marginBottom:"2.5rem"}}>
        <div className="has_btn_input">
          <Form.Item name="category_name">
            <Input placeholder="카테고리명을 입력해 주세요" />
          </Form.Item>
          <div className="flex_box j_cen">
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              등록
            </Button>
          </div>
        </div>
      </Form>
      <h3 className="title"><mdIcon.MdOutlineSubtitles />등록된 카테고리</h3>
      <ul className="cate_list">
        {category && category.map((el, idx) => 
          (
            <li key={idx}>
              {el.name}
              <button type="button" onClick={()=>onCateDel(`${el.name}|${el.uid}`,`${el.uid}`)}>
                <riIcon.RiCloseFill />
                삭제
              </button>
            </li>
          )
        )}
      </ul>
    </>
  );
}

export default Admin;
