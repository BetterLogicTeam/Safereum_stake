import React from "react";
import "./Updated.css";
import size from "../Accets/sa_logo.png";
import up from "../Accets/up.png";
import { FaWallet } from "react-icons/fa";
import { AiFillClockCircle } from "react-icons/ai";
import { BsFillKeyboardFill } from "react-icons/bs";
import { BsCheck2All } from "react-icons/bs";
import { FaMousePointer } from "react-icons/fa";

export default function Updated() {
  return (
    <div className="upadted   ">
      <div className="text-center">
        <h3 className="htu text-center site_font text-white">How to Stake TIPCOIN ?</h3>

        <p className="htu_p site_font">
          Before following the steps to stake your TIPCOIN , you will need to
          fund your wallet with TIPCOIN. Get your TIPCOIN from UNISWAP and then
          follow the steps on this app to stake your TIPCOIN to Earn TIP coin.
        </p>
        <a
          className="text-decoration-none"
          target="_blank"
          href="https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x0176b898e92e814c06cc379e508ceb571f70bd40"
        >
          {" "}
          <button className="site_button">BUY TIPCOIN</button>
        </a>

        <div className="container py-5">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6">
              <img src={size} alt="" className="res_size" />
            </div>
            <div className="col-md-6">
              <div className="up_box">
                <p className="mb-0 p-0">
                  <FaWallet className="icon_fs"></FaWallet>
                </p>
                <h5  className="site_font"> Connect your wallet </h5>
              </div>
              <div className="up_box">
                <p className="mb-0 p-0">
                  <BsFillKeyboardFill className="icon_fs"></BsFillKeyboardFill>
                </p>
                <h6 className="site_font"> Input the amount of TIPCOIN (Min:1 ARB) to stake </h6>
              </div>
              <div className="up_box">
                <p className="mb-0 p-0">
                  <AiFillClockCircle className="icon_fs"></AiFillClockCircle>
                </p>
                <h5 className="site_font"> Select 'LOCK' Period </h5>
              </div>
              <div className="up_box">
                <p className="mb-0 p-0">
                  <FaMousePointer className="icon_fs"></FaMousePointer>
                </p>
                <h5 className="site_font"> Select 'STAKE' button </h5>
              </div>
              <div className="up_box">
                <p className="mb-0 p-0">
                  <BsCheck2All className="icon_fs"></BsCheck2All>
                </p>
                <h5 className="site_font"> Confirm transaction in your wallet </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
