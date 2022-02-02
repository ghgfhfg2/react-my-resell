import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "../firebase";
import SellPop from "./SellPop";
import { Empty } from "antd";

function List() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const db = firebase.database();

  const [prodList, setProdList] = useState();
  useEffect(() => {
    let arr = [];
    db.ref(`prod_list/${userInfo.uid}`).on("value", (data) => {
      data.forEach((el) => {
        arr.push({
          ...el.val(),
          prod_cate: el.val().prod_cate.split("|")[0],
          key: el.key,
        });
      });
      setProdList(arr);
    });
    return () => {
      db.ref(`prod_list/${userInfo.uid}`).off();
    };
  }, []);

  const [sellPop, setSellPop] = useState(false);
  const [prodUid, setProdUid] = useState();
  const [prodPrice, setProdPrice] = useState();
  const onSellPop = (uid, price) => {
    setProdUid(uid);
    setSellPop(true);
    setProdPrice(price);
  };

  return (
    <>
      <ul className="prod_list">
        {prodList && prodList.length > 0 ? (
          prodList.map((el, idx) => (
            <li key={idx}>
              <span className="cate">{el.prod_cate}</span>
              <div className="name_box">
                <span className="name">{el.prod_name}</span>
                <span className="option">{el.prod_option}</span>
              </div>
              <span className="price">{el.prod_price}</span>
              <button
                type="button"
                className="basic"
                onClick={() => {
                  onSellPop(el.key, el.prod_price);
                }}
              >
                판매
              </button>
            </li>
          ))
        ) : (
          <li>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </li>
        )}
      </ul>
      {sellPop && <SellPop prodUid={prodUid} prodPrice={prodPrice} />}
    </>
  );
}

export default List;
