import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useSelector } from "react-redux";
import firebase from "../firebase";
import uuid from "react-uuid";

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

function Admin() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const db = firebase.database();

  const [category, setCategory] = useState();
  useEffect(() => {
    let arr = [];
    db.ref(`category/${userInfo.uid}`).on("value", (data) => {
      data.forEach((el) => {
        arr.push(el.val());
      });
      setCategory(arr);
    });
  }, []);

  const onFinish = (values) => {
    const uid = uuid();
    db.ref(`category/${userInfo.uid}/${uid}`).update({
      uid,
      name: values.category_name,
    });
    console.log("Success:", values);
  };
  return (
    <>
      <Form {...layout} onFinish={onFinish}>
        <Form.Item label="카테고리명" name="category_name">
          <Input style={{ maxWidth: "500px" }} />
        </Form.Item>
        <div className="flex_box j_cen">
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            등록1
          </Button>
        </div>
      </Form>
      <ul>
        {category && category.map((el, idx) => <li key={idx}>{el.name}</li>)}
      </ul>
    </>
  );
}

export default Admin;
