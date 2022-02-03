import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "../firebase";
import SellPop from "./SellPop";
import Loading from "./Loading";
import { commaNumber } from "./CommonFunc";
import { Empty } from "antd";

function List() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const db = firebase.database();

  const [prodList, setProdList] = useState('');
  useEffect(() => {
    let arr = [];
    userInfo &&
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
      userInfo && db.ref(`prod_list/${userInfo.uid}`).off();
    };
  }, [userInfo]);

  const [sellPop, setSellPop] = useState(false);
  const [prodUid, setProdUid] = useState();
  const [prodPrice, setProdPrice] = useState();
  const onSellPop = (uid, price) => {
    setProdUid(uid);
    setSellPop(true);
    setProdPrice(price);
  };

  const onClose = () => {
    setSellPop(false);
  };

  return (
    <>
      {prodList ? (
      <ul className="prod_list">
          {prodList.length > 0 ? (prodList.map((el, idx) => (
            <li key={idx}>
              <div className="top">
                <span className="cate">{el.prod_cate}</span>
                <span className="date">구매일 : {el.buy_date.full_}</span>
              </div>
              <div className="name_box">
                <span className="name">{el.prod_name}</span>
                <span className="option">{el.prod_option}</span>
              </div>
              <span className="price">{commaNumber(el.prod_price)}원</span>
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
          ))):
          (
            <li className="flex_box j_cen">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </li>
          )
          }
      </ul>
      ) : (
        <Loading />
        )
      }
      <SellPop prodUid={prodUid} prodPrice={prodPrice} visible={sellPop} onClose={onClose} />
    </>
  );
}

export default List;
