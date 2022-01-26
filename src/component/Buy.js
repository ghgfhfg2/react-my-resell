import React from "react";
import { Form, Input, InputNumber, Button, Cascader, DatePicker } from "antd";

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

function Buy() {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  return (
    <>
      <Form {...layout} onFinish={onFinish}>
        <Form.Item label="상품명" name="prod_name" rules={[{ required: true }]}>
          <Input />
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
        <Button type="primary" htmlType="submit">
          등록
        </Button>
      </Form>
    </>
  );
}

export default Buy;
