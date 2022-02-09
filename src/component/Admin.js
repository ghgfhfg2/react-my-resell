import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, message, Popconfirm } from "antd";
import { useSelector } from "react-redux";
import firebase from "../firebase";
import uuid from "react-uuid";
import * as mdIcon from "react-icons/md";
import * as riIcon from "react-icons/ri";
import { xssReplace } from "./CommonFunc";

function Admin() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const db = firebase.database();
  const form = useRef();

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
    const cateTest = xssReplace(values.category_name);
    if (cateTest) {
      message.error("카테고리에 특수문자를 포함할 수 없습니다.");
    }
    if (values.category_name.length > 15) {
      message.error("카테고리는 15글자 이하로 작성가능합니다");
      return;
    }
    db.ref(`category/${userInfo.uid}/${uid}`)
      .update({
        uid,
        name: values.category_name,
      })
      .then(() => {
        message.success(`${values.category_name}이(가) 등록되었습니다`);
        formInit();
      });
  };

  const formInit = () => {
    form.current.setFieldsValue({
      category_name: undefined,
    });
  };

  const onCateDel = (uid, uid2, name) => {
    db.ref(`prod_list/${userInfo.uid}`)
      .orderByChild("prod_cate")
      .equalTo(uid)
      .once("value", (data) => {
        data.forEach((el) => {
          db.ref(`prod_list/${userInfo.uid}/${el.key}`).remove();
        });
      });
    db.ref(`category/${userInfo.uid}/${uid2}`).remove();
    message.success(`${name}이(가) 삭제되었습니다`);
  };

  return (
    <>
      <div className="admin_top">
        <Form ref={form} onFinish={onFinish}>
          <div className="has_btn_input">
            <Form.Item name="category_name">
              <Input placeholder="카테고리명을 입력해 주세요" />
            </Form.Item>
            <div className="flex_box j_cen">
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                등록
              </Button>
            </div>
          </div>
        </Form>
      </div>
      <h3 className="title">
        <mdIcon.MdOutlineSubtitles />
        등록된 카테고리
      </h3>
      <ul className="cate_list">
        {category &&
          category.map((el, idx) => (
            <li key={idx}>
              {el.name}
              <Popconfirm
                placement="top"
                title="해당 카테고리 내의 상품도 모두 삭제됩니다."
                onConfirm={() =>
                  onCateDel(`${el.name}|${el.uid}`, `${el.uid}`, `${el.name}`)
                }
                okText="네"
                cancelText="아니오"
              >
                <button type="button">
                  <riIcon.RiCloseFill />
                  삭제
                </button>
              </Popconfirm>
            </li>
          ))}
      </ul>
    </>
  );
}

export default Admin;
