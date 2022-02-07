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
import { getFormatDate,xssReplace } from "./CommonFunc";

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
    const nameTest = xssReplace(values.prod_name);
    const opTest = xssReplace(values.prod_option);
    if(nameTest){
      message.error('상품명에 특수문자를 포함할 수 없습니다.')
    }
    if(values.prod_name.length > 15){
      message.error('상품명은 15글자 이하로 작성가능합니다')
      return
    }
    if(opTest){
      message.error('상품명에 특수문자를 포함할 수 없습니다.')
    }
    if(values.prod_option.length > 15){
      message.error('옵션은 15글자 이하로 작성가능합니다')
      return
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
      {category.length > 0 ? (
      <Form
        ref={form}
        {...layout}
        onFinish={onFinish}
        initialValues={{
          buy_date: moment(),
        }}        
        validateMessages={{
          required: '${label}는(은) 필수항목 입니다.',
        }}
      >
        <Form.Item label="상품명" name="prod_name" rules={[{ required: true }]}
        >
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
            {
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
      ):(
        <div className="d_col flex_box j_cen" style={{paddingTop:"20px"}}>
          카테고리 등록이 필요합니다.
          <Link to="/admin" style={{marginTop:"10px"}}><Button>카테고리 설정</Button></Link>
        </div>
      )}
    </>
  );
}

export default Buy;
