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
  const [incomeList, setIncomeList] = useState();
  useEffect(() => {
    const getIncomePer = async () => {
      let buy = await (await db.ref(`user/${userInfo.uid}/buy_price`).get("value")).val();
      let sell = await (await db.ref(`user/${userInfo.uid}/sell_price`).get("value")).val();
      let income = (await db.ref(`user/${userInfo.uid}/income`).get("value")).val();
      let arr = [];
      db.ref(`user/${userInfo.uid}/income_list`).once("value", data => {
        data.forEach(list=>{
          arr.push(list.val());
        })
        arr.sort((a,b)=>{
          return a.time - b.time
        })
        setIncomeList(arr)
      })
      let per = (income / buy) * 100;
      per = Math.floor(per * 10) / 10;
      setBuyTotal(buy);
      setSellTotal(sell);
      setIncome(income);
      setIncomePer(per);
    };
    userInfo && getIncomePer();
  }, [userInfo]);

  return (
    <>
      {isNaN(incomePer) || (
        <>
          <div className="income_wrapper">
            <div className="buy_sell_box">
              <dl>
                <dt>구매금액</dt>
                <dd className="minus">{commaNumber(buyTotal)}<span className="txt">원</span></dd>
              </dl>
              <dl>
                <dt>판매금액</dt>
                <dd className="plus">{commaNumber(sellTotal)}<span className="txt">원</span></dd>
              </dl>
              <dl>
                <dt>수익금액</dt>
                <dd
                  className={
                    incomePer > 0 ? `plus` :
                    incomePer < 0 ? `minus` : `` 
                  }
                >{commaNumber(income)}<span className="txt">원</span></dd>
              </dl>
              <dl>
                <dt>수익률</dt>
                <dd>
                  {incomePer > 0 ? (
                      <span className="plus">
                        +{commaNumber(incomePer)}<span className="txt">%</span>
                      </span>
                    ) : 
                    incomePer === 0 ? (
                      <span>
                        {commaNumber(incomePer)}<span className="txt">%</span>
                      </span>
                    ) : (
                      <span className="minus">
                        -{commaNumber(incomePer)}<span className="txt">%</span>
                      </span>
                    )
                  }
                </dd>
              </dl>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Info;
