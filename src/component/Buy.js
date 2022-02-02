import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, Button, DatePicker } from "antd";
import { useSelector } from "react-redux";
import firebase from "firebase";
import uuid from "react-uuid";
import { getFormatDate } from "./CommonFunc";

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

function Buy() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const db = firebase.database();

  const [category, setCategory] = useState([]);
  useEffect(() => {
    let arr = [];
    db.ref(`category/${userInfo.uid}`).once("value", (data) => {
      data.forEach((el) => {
        arr.push(el.val());
      });
      setCategory(arr);
    });
  }, []);

  const onFinish = (values) => {
    let uid = uuid();
    values.buy_date = getFormatDate(values.buy_date._d);
    db.ref(`prod_list/${userInfo.uid}/${uid}`).update({
      ...values,
    });

    db.ref(`user/${userInfo.uid}/buy_price`).transaction((pre) => {
      return pre + values.prod_price;
    });
  };
  return (
    <>
      <Form {...layout} onFinish={onFinish}>
        <Form.Item label="상품명" name="prod_name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="옵션" name="prod_option">
          <Input />
        </Form.Item>
        <Form.Item
          label="카테고리"
          name="prod_cate"
          rules={[{ required: true }]}
        >
          <Select>
            {category &&
              category.map((el, idx) => (
                <Select.Option key={idx} value={`${el.name}|${el.uid}`}>
                  {el.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="상품가격"
          name="prod_price"
          rules={[{ required: true }]}
        >
          <InputNumber
            style={{ width: "100%", maxWidth: "300px" }}
            controls={false}
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
        <Form.Item label="구매일" name="buy_date" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          등록
        </Button>
      </Form>
    </>
  );
}

export default Buy;
