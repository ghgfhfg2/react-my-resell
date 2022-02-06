import React, { useRef } from "react";
import { Form, InputNumber, Button, DatePicker, Drawer, message } from "antd";
import { useSelector } from "react-redux";
import firebase from "../firebase";
import { getFormatDate } from "./CommonFunc";
import moment from "moment";
import uuid from "react-uuid";

function SellPop({ prodUid, prodPrice, visible, onClose, prodName }) {
  const userInfo = useSelector((state) => state.user.currentUser);
  const db = firebase.database();
  const form = useRef();

  const formInit = () => {
    form.current.setFieldsValue({
      prod_price: undefined,
    });
  };
  const onFinish = (values) => {
    values.sell_date = values.sell_date ? values.sell_date : moment();
    values.sell_date = getFormatDate(values.sell_date._d);
    let date = {
      full_: values.sell_date.full_,
      time: values.sell_date.timestamp,
    };
    db.ref(`prod_list/${userInfo.uid}/${prodUid}`).update({
      sell_date: values.sell_date,
      sell_price: values.prod_price,
      step: 2,
    });

    db.ref(`user/${userInfo.uid}/sell_price`).transaction((pre) => {
      return pre + values.prod_price;
    });

    db.ref(`user/${userInfo.uid}/income`).transaction((pre) => {
      let distance = 0;
      if (prodPrice <= values.prod_price) {
        distance = values.prod_price - prodPrice;
        return pre + distance;
      } else {
        distance = prodPrice - values.prod_price;
        return pre - distance;
      }
    });

    db.ref(`user/${userInfo.uid}/total_income`).transaction((pre) => {
      return pre + values.prod_price;
    });

    let distance = values.prod_price - prodPrice;
    db.ref(`user/${userInfo.uid}/income_list/${uuid()}`).update({
      income: distance,
      date: date.full_,
      time: date.time,
      name: prodName,
    });
    message.success("판매되었습니다.");
    formInit();
    onClose();
  };
  return (
    <>
      <Drawer
        placement="bottom"
        visible={visible}
        onClose={onClose}
        closable={false}
        height={165}
      >
        <Form
          ref={form}
          onFinish={onFinish}
          className="sell_pop"
          initialValues={{
            sell_date: moment(),
          }}
        >
          <Form.Item name="prod_price" rules={[{ required: true }]}>
            <InputNumber
              placeholder="상품가격"
              style={{ width: "100%" }}
              controls={false}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>
          <Form.Item name="sell_date">
            <DatePicker
              placeholder="판매일"
              style={{ width: "100%" }}
              format={`YYYY-MM-DD`}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="btn">
            판매
          </Button>
        </Form>
      </Drawer>
    </>
  );
}

export default SellPop;
