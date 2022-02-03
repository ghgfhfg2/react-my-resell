import { Form, InputNumber, Button, DatePicker, Drawer } from "antd";
import { useSelector } from "react-redux";
import firebase from "../firebase";
import { getFormatDate } from "./CommonFunc";

function SellPop({ prodUid, prodPrice, visible, onClose }) {
  const userInfo = useSelector((state) => state.user.currentUser);
  const db = firebase.database();
  const onFinish = (values) => {
    values.sell_date = getFormatDate(values.sell_date._d);
    db.ref(`prod_list/${userInfo.uid}/${prodUid}`).update({
      sell_date: values.sell_date,
      sell_price: values.prod_price,
      step:2
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
  };
  return (
    <>
      <Drawer placement="bottom" visible={visible} onClose={onClose}>
        <Form onFinish={onFinish}>
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
          <Form.Item label="판매일" name="sell_date" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            판매
          </Button>
        </Form>
      </Drawer>
    </>
  );
}

export default SellPop;
