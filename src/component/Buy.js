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
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import firebase from "firebase";
import uuid from "react-uuid";
import moment from "moment";
import { getFormatDate, xssReplace } from "./CommonFunc";

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
    const nameTest = xssReplace(values.prod_name);
    const opTest = xssReplace(values.prod_option);
    if (nameTest) {
      message.error("상품명에 특수문자를 포함할 수 없습니다.");
    }
    if (values.prod_name.length > 15) {
      message.error("상품명은 15글자 이하로 작성가능합니다");
      return;
    }
    if (opTest) {
      message.error("상품명에 특수문자를 포함할 수 없습니다.");
    }
    if (values.prod_option.length > 15) {
      message.error("옵션은 15글자 이하로 작성가능합니다");
      return;
    }
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
      <div className="content_box pd">
        {category.length > 0 ? (
          <Form
            ref={form}
            onFinish={onFinish}
            initialValues={{
              buy_date: moment(),
            }}
            validateMessages={{
              required: "${label}는(은) 필수항목 입니다.",
            }}
            className="write_form"
          >
            <Form.Item name="prod_cate" rules={[{ required: true }]}>
              <Select placeholder="카테고리">
                {category.map((el, idx) => (
                  <Select.Option key={idx} value={`${el.name}|${el.uid}`}>
                    {el.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="prod_name" rules={[{ required: true }]}>
              <Input placeholder="상품명" />
            </Form.Item>
            <Form.Item name="prod_option">
              <Input placeholder="옵션명" />
            </Form.Item>
            <div className="flex_box price_date_box">
              <Form.Item
                name="prod_price"
                className="price"
                rules={[{ required: true }]}
              >
                <InputNumber
                  placeholder="상품가격"
                  controls={false}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <div className="label_box">
                <span className="label">구매일</span>
                <Form.Item name="buy_date">
                  <DatePicker format={`YYYY-MM-DD`} />
                </Form.Item>
              </div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                marginTop: "15px",
                height: "46px",
                borderRadius: "10px",
              }}
            >
              등록
            </Button>
          </Form>
        ) : (
          <div className="d_col flex_box j_cen" style={{ paddingTop: "20px" }}>
            카테고리 등록이 필요합니다.
            <Link to="/admin" style={{ marginTop: "10px" }}>
              <Button>카테고리 설정</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Buy;
