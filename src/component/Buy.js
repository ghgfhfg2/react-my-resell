import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  DatePicker,
  message,
} from "antd";
import { useSelector } from "react-redux";
import firebase from "firebase";
import uuid from "react-uuid";
import moment from "moment";
import { getFormatDate } from "./CommonFunc";

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

function Buy() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const db = firebase.database();
  const form = useRef();

  const formInit = () => {
    form.current.setFieldsValue({
      prod_name: undefined,
      prod_option: undefined,
      prod_cate: undefined,
      prod_price: undefined,
    });
  };

  const [category, setCategory] = useState([]);
  useEffect(() => {
    let arr = [];
    userInfo &&
      db.ref(`category/${userInfo.uid}`).once("value", (data) => {
        data.forEach((el) => {
          arr.push(el.val());
        });
        setCategory(arr);
      });
  }, [userInfo]);

  const onFinish = (values) => {
    let uid = uuid();
    values.buy_date = values.buy_date ? values.buy_date : moment();
    values.buy_date = getFormatDate(values.buy_date._d);
    db.ref(`prod_list/${userInfo.uid}/${uid}`).update({
      ...values,
      step: 1,
    });
    db.ref(`user/${userInfo.uid}/buy_price`).transaction((pre) => {
      return pre + values.prod_price;
    });
    db.ref(`user/${userInfo.uid}/total_income`).transaction((pre) => {
      return pre - values.prod_price;
    });
    message.success("등록되었습니다.");
    formInit();
  };
  return (
    <>
      <Form
        ref={form}
        {...layout}
        onFinish={onFinish}
        initialValues={{
          buy_date: moment(),
        }}
      >
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
            style={{ width: "100%", maxWidth: "400px" }}
            controls={false}
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
        <Form.Item label="구매일" name="buy_date">
          <DatePicker
            style={{ width: "100%", maxWidth: "400px" }}
            format={`YYYY-MM-DD`}
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%", marginTop: "15px" }}
        >
          등록
        </Button>
      </Form>
    </>
  );
}

export default Buy;
