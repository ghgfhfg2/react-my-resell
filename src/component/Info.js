import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "../firebase";
import { commaNumber } from "./CommonFunc";
import { Table } from "antd";
import * as mdIcon from "react-icons/md"

function Info() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const db = firebase.database();

  const [buyTotal, setBuyTotal] = useState(0);
  const [sellTotal, setSellTotal] = useState(0);
  const [income, setIncome] = useState(0);
  const [incomePer, setIncomePer] = useState(0);
  const [incomeList, setIncomeList] = useState();
  useEffect(() => {
    const getIncomePer = async () => {
      let buy = await (
        await db.ref(`user/${userInfo.uid}/buy_price`).get("value")
      ).val();
      let sell = await (
        await db.ref(`user/${userInfo.uid}/sell_price`).get("value")
      ).val();
      let income = (
        await db.ref(`user/${userInfo.uid}/income`).get("value")
      ).val();
      let arr = [];
      db.ref(`user/${userInfo.uid}/income_list`).limitToLast(100).once("value", (data) => {
        data.forEach((list) => {
          arr.push(list.val());
        });
        arr.sort((a, b) => {
          return a.time - b.time;
        });
        setIncomeList(arr);
      });
      let per = 0;
      if (income) {
        per = (income / buy) * 100;
        per = Math.floor(per * 10) / 10;
      }
      sell = sell ? sell : 0;
      income = income ? income : 0;
      per = per ? per : 0;
      setBuyTotal(buy);
      setSellTotal(sell);
      setIncome(income);
      setIncomePer(per);
    };
    userInfo && getIncomePer();
  }, [userInfo]);


  const columns = [
    {
      title: '상품명',
      dataIndex: 'name',
      key: 'name',
      align: "center"
    },
    {
      title: '판매일',
      dataIndex: 'date',
      key: 'date',
      align: "center"
    },
    {
      title: '수익금액',
      dataIndex: 'income',
      key: 'income',
      align: 'right',
      render: data => data < 0 ? <span class="minus">{commaNumber(data)}</span> : data > 0 ? <span class="plus">{commaNumber(data)}</span> : <span>0</span>
    },
  ]

  return (
    <>
      <div className="income_wrapper">
        <div className="buy_sell_box">
          <dl>
            <dt>구매금액</dt>
            <dd className="minus">
              {buyTotal ? (
                <>
                  {commaNumber(buyTotal)}
                  <span className="txt">원</span>
                </>
              ) : (
                <>
                  0<span className="txt">원</span>
                </>
              )}
            </dd>
          </dl>
          <dl>
            <dt>판매금액</dt>
            <dd className="plus">
              {sellTotal ? (
                <>
                  {commaNumber(sellTotal)}
                  <span className="txt">원</span>
                </>
              ) : (
                <>
                  0<span className="txt">원</span>
                </>
              )}
            </dd>
          </dl>
          <dl>
            <dt>수익금액</dt>
            <dd
              className={incomePer > 0 ? `plus` : incomePer < 0 ? `minus` : ``}
            >
              {commaNumber(income)}
              <span className="txt">원</span>
            </dd>
          </dl>
          <dl>
            <dt>수익률</dt>
            <dd>
              {incomePer > 0 ? (
                <>
                  <span className="plus">
                    +{commaNumber(incomePer)}
                    <span className="txt">%</span>
                  </span>
                </>
              ) : incomePer === 0 ? (
                <>
                  <span>
                    {commaNumber(incomePer)}
                    <span className="txt">%</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="minus">
                    -{commaNumber(incomePer)}
                    <span className="txt">%</span>
                  </span>
                </>
              )}
            </dd>
          </dl>
        </div>
        <div className="income_tbl">
          <h3 className="title"><mdIcon.MdOutlineSubtitles />판매내역
            <span style={{fontSize:"12px",color:"#888",fontWeight:"300",marginTop:"2px",marginLeft:"5px"}}>※ 최근 100개의 내역까지 보여집니다</span>
          </h3>
          <Table 
            size="small"
            dataSource={incomeList} columns={columns}
          />
        </div>
        
      </div>
    </>
  );
}

export default Info;
