import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "../firebase";
import { commaNumber } from "./CommonFunc";

function Info() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const db = firebase.database();

  const [buyTotal, setBuyTotal] = useState();
  const [sellTotal, setSellTotal] = useState();
  const [income, setIncome] = useState();
  const [incomePer, setIncomePer] = useState();
  useEffect(() => {
    const getIncomePer = async () => {
      let buy = await (
        await db.ref(`user/${userInfo.uid}/buy_price`).get("value")
      ).val();
      let sell = await (
        await db.ref(`user/${userInfo.uid}/sell_price`).get("value")
      ).val();
      let income = await (
        await db.ref(`user/${userInfo.uid}/income`).get("value")
      ).val();
      let per = (income / buy) * 100;
      per = Math.floor(per * 10) / 10;
      setBuyTotal(buy);
      setSellTotal(sell);
      setIncome(income);
      setIncomePer(per);
    };
    getIncomePer();
  }, []);

  return (
    <>
      {incomePer && (
        <ul>
          <li>{commaNumber(buyTotal)}원</li>
          <li>{commaNumber(sellTotal)}원</li>
          <li>
            {commaNumber(income)}원 {incomePer}%
          </li>
        </ul>
      )}
    </>
  );
}

export default Info;
