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

  const [stepState, setStepState] = useState(1);
  const onStepChange = (step) => {
    setStepState(step);
    step === 1 ? setProdList(ableList) : setProdList(finishList);
  };

  const [prodList, setProdList] = useState("");
  const [ableList, setAbleList] = useState("");
  const [finishList, setFinishList] = useState("");
  useEffect(() => {
    userInfo &&
      db.ref(`prod_list/${userInfo.uid}`).on("value", (data) => {
        let arr = [];
        data.forEach((el) => {
          arr.push({
            ...el.val(),
            prod_cate: el.val().prod_cate.split("|")[0],
            key: el.key,
          });
        });
        let prodArr = arr.filter((el) => {
          return el.step === 1;
        });
        let finishArr = arr.filter((el) => {
          return el.step === 2;
        });
        setProdList(prodArr);
        setAbleList(prodArr);
        setFinishList(finishArr);
      });
    return () => {
      userInfo && db.ref(`prod_list/${userInfo.uid}`).off();
    };
  }, [userInfo]);

  const [sellPop, setSellPop] = useState(false);
  const [prodUid, setProdUid] = useState();
  const [prodPrice, setProdPrice] = useState();
  const [prodName, setProdName] = useState();
  const onSellPop = (uid, price, name) => {
    setProdUid(uid);
    setSellPop(true);
    setProdPrice(price);
    setProdName(name);
  };

  const onClose = () => {
    setSellPop(false);
  };

  return (
    <>
      <ul className="com_tab">
        <li
          onClick={() => onStepChange(1)}
          className={stepState === 1 ? `on` : ``}
        >
          판매 가능
        </li>
        <li
          onClick={() => onStepChange(2)}
          className={stepState === 2 ? `on` : ``}
        >
          판매 완료
        </li>
      </ul>
      {prodList ? (
        <ul className="prod_list">
          {prodList.length > 0 ? (
            prodList.map((el, idx) => (
              <li key={idx}>
                <div className="top">
                  <span className="cate">{el.prod_cate}</span>
                  {stepState === 1 ? (
                    <>
                      <span className="date">구매일 : {el.buy_date.full_}</span>
                    </>
                  ) : (
                    <>
                      <span className="date">
                        판매일 : {el.sell_date.full_}
                      </span>
                    </>
                  )}
                </div>
                <div className="name_box">
                  <span className="name">{el.prod_name}</span>
                  <span className="option">{el.prod_option}</span>
                </div>
                {stepState === 1 ? (
                  <>
                    <span className="price">
                      {commaNumber(el.prod_price)}원
                    </span>
                    <button
                      type="button"
                      className="basic"
                      onClick={() => {
                        onSellPop(el.key, el.prod_price, el.prod_name);
                      }}
                    >
                      판매
                    </button>
                  </>
                ) : (
                  <>
                    <span className="price">
                      {commaNumber(el.sell_price)}원
                    </span>
                  </>
                )}
              </li>
            ))
          ) : (
            <li className="flex_box j_cen">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </li>
          )}
        </ul>
      ) : (
        <Loading />
      )}
      <SellPop
        prodUid={prodUid}
        prodPrice={prodPrice}
        prodName={prodName}
        visible={sellPop}
        onClose={onClose}
      />
    </>
  );
}

export default List;
