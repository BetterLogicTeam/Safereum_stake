import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Web3 from "web3";
import {
  Staking,
  Staking_Abi,
  TokenAddress,
  Token_Abi,
  ArchieMetaNFT,
  nftTokenAddress,
  nftToken_Abi,
  ArchieMetaNFT_Abi,
  tokenStaking,
  tokenStaking_Abi,
  ARBStaking,
  ARBStaking_Abi,
  ARBtoken,
  ARBtoken_Abi,
} from "../../utilies/constant";
import Connent from "../Connent/Connent";
import "./Lockestake.css";
import Countdown from "react-countdown";
import moment from "moment/moment";
import { Button, Popover } from "antd";
import { Modal, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAccount } from "wagmi";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";

function Lockestake({ setShoww, check }) {
  let { provider, acc, providerType, web3 } = useSelector(
    (state) => state.connectWallet
  );
  const { address } = useAccount();
  const [selectDays, setselectDays] = useState(0);
  const [selectpercent, setpercent] = useState(0);

  const [getValue, setgetValue] = useState(0);
  const [Active, setActive] = useState(0);
  const [spinner, setspinner] = useState(false);
  const [balance, setbalance] = useState(0);
  const [selectedCard, setselectedCard] = useState(null);
  const [cradShow, setcradShow] = useState([]);
  const [stakeddata, setstakeddata] = useState();
  const [cardIndex, setcardIndex] = useState([]);
  const [slectedAllnfton, setslectedAllnfton] = useState({
    condition: false,
    walletOfOwneron: [],
  });
  const [noSelectedAll, setnoSelectedAll] = useState([]);
  const webSupply = new Web3("https://ethereum.publicnode.com");

  const staking_Amount = async () => {
    try {
      if (selectDays == 1) {
        toast.error("Please Select Days");
        setspinner(false);
      } else {
        if (getValue == null) {
          toast.error("Please Enter Amount First!");
          setspinner(false);
        } else {
          if (getValue < 1) {
            toast.error("Minimum Staking Amount 1!");
            setspinner(false);
          } else {
            if (!address) {
              toast.error("Please Connect Metamaske First!");
              setShoww(true);
            } else {
              setspinner(true);
              let stakingContractOf;
              let tokenContractOf;
              // if (check == "one") {
              //   stakingContractOf = new web3.eth.Contract(
              //     ARBStaking_Abi,
              //     ARBStaking
              //   );
              //   tokenContractOf = new web3.eth.Contract(ARBtoken_Abi, ARBtoken);
              // } else {
              //   stakingContractOf = new web3.eth.Contract(Staking_Abi, Staking);
              //   tokenContractOf = new web3.eth.Contract(
              //     Token_Abi,
              //     TokenAddress
              //   );
              // }

              let stakingValue = webSupply.utils.toWei(getValue);
              // let checkstakingValue = web3.utils.toWei(getValue);
              let checkbalance = webSupply.utils.toWei(balance);
              if (check == "one") {
                if (Number(checkbalance) >= Number(stakingValue)) {
                  const { request } = await prepareWriteContract({
                    address: ARBtoken,
                    abi: ARBtoken_Abi,
                    functionName: "approve",
                    args: [ARBStaking, stakingValue.toString()],
                    account: address,
                  });
                  const { hash } = await writeContract(request);
                  const data = await waitForTransaction({
                    hash,
                  });

                  setTimeout(async () => {
                    toast.success("Approve Confirmed");
                    const { request } = await prepareWriteContract({
                      address: ARBStaking,
                      abi: ARBStaking_Abi,
                      functionName: "farm",
                      args: [stakingValue.toString(), selectDays],
                      account: address,
                    });
                    const { hash } = await writeContract(request);
                    const data = await waitForTransaction({
                      hash,
                    });
                    toast.success("ARB Token Staked Successfull.");
                    setspinner(false);
                  }, 1000);
                } else {
                  toast.error("Insufficient Balance");
                  setspinner(false);
                }
              } else {
                if (cardIndex.length == 0) {
                  toast.error("Please Select NFT First!");
                  setspinner(false);
                } else {
                  // console.log("selectedCard",selectedCard);
                  let min_Select = await stakingContractOf.methods
                    .minimumNFT()
                    .call();

                  let max_Select = await stakingContractOf.methods
                    .maximumNFT()
                    .call();

                  if (min_Select > cardIndex.length) {
                    toast.error(`Select Minimum NFT ${min_Select}`);
                    setspinner(false);
                  } else {
                    if (max_Select < cardIndex.length) {
                      toast.error(`Maximum NFT ${max_Select}`);

                      setspinner(false);
                    } else {
                      console.log("cardIndex", cardIndex);
                      await tokenContractOf.methods
                        .approve(Staking, stakingValue)
                        .send({
                          from: acc,
                        });
                      toast.success("Approve Confirmed");
                      console.log("cardIndex", cardIndex);
                      await stakingContractOf.methods
                        .farm(stakingValue, selectDays, cardIndex)
                        .send({
                          from: acc,
                        });
                      toast.success("Transaction Confirmed");
                      setspinner(false);
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.log("Error", e);
      setspinner(false);
    }
  };
  const checkBalance = async () => {

    let tokenContractOf = new webSupply.eth.Contract(ARBtoken_Abi, ARBtoken);
    let stakingContractOf = new webSupply.eth.Contract(
      ARBStaking_Abi,
      ARBStaking
    );

    if (address) {
      let blanceOf = await tokenContractOf.methods.balanceOf(address).call();

      blanceOf = webSupply.utils.fromWei(blanceOf);

      blanceOf = blanceOf.slice(0, 12);
      // console.log("blanceOf", blanceOf);
      setbalance(blanceOf);
    }
  };

  useEffect(() => {
    checkBalance();
  });

  const SelectedCard = async (id, tokenid) => {
    try {
      let change_Color = document.getElementById(id);
      change_Color.style.border = `5px solid rgb(56, 195, 207)`;
      change_Color.style.borderRadius = "35px";
      let check = [...cardIndex, tokenid];
      let array_Length = check.length;

      console.log("checkcheck", check);
      check = check.map(Number);

      setcardIndex(check);

      setselectedCard(id);
    } catch (e) {
      console.log("Error while Selected Card", e);
    }
  };

  const TotalAmount = async () => {
    try {
      const webSupply = new Web3("https://ethereum.publicnode.com");
      let stakingContractOf = new webSupply.eth.Contract(Staking_Abi, Staking);
      let nFTContractOf = new webSupply.eth.Contract(
        ArchieMetaNFT_Abi,
        ArchieMetaNFT
      );

      let array = [];
      if (acc != null) {
        let UserNFTs = await nFTContractOf.methods.walletOfOwner(acc).call();

        // setslectedAllnfton({ walletOfOwneron: UserNFTs });
        let UserNFTs_Length = UserNFTs.length;
        let nweArray = [];

        for (let i = 0; i < UserNFTs_Length; i++) {
          let nftLink = await axios.get(
            `https://teal-high-elephant-254.mypinata.cloud/ipfs/QmRN9mG46UtACjCmtwjnqz2pmDei2tUP6zB23NpFw8wk8C/${
              UserNFTs[i + 1]
            }.png`
          );
          let isNFTStaked = await stakingContractOf.methods
            .isNFTStaked(UserNFTs[i])
            .call();
          console.log("UserNFTs", isNFTStaked);

          if (isNFTStaked == true) {
            setstakeddata(UserNFTs[i]);
          } else {
            nweArray = [...nweArray, UserNFTs[i]];
            // console.log("TokenId",nweArray);
            setnoSelectedAll(nweArray);
            // setslectedAllnfton({ walletOfOwneron: nweArray });
          }
          let imgurl = nftLink.config.url;
          // console.log("nftLink", nftLink.config.url);
          array = [
            ...array,
            { imgurl: imgurl, tokenid: UserNFTs[i], selecteddata: isNFTStaked },
          ];
          setcradShow(array);
        }
      }
    } catch (e) {
      console.log("error While calling function", e);
    }
  };

  const selectAllNFT = async () => {
    try {
      setslectedAllnfton({ condition: true });
      console.log("slectedAllnfton.walletOfOwneron", noSelectedAll);
      setcardIndex(noSelectedAll);
    } catch (error) {
      console.log("Error When SelectAll Nft Fuction", error);
    }
  };

  useEffect(() => {
    TotalAmount();
  }, [acc]);

  return (
    <>
      {check == "one" ? (
        <>
          {/* {acc == null ? (
            <Connent setShoww={setShoww} />
          ) : ( */}
          <>
        

        
            <div className="container-fluid p-0 pb-5 bbor mt-5 ">
              <div className="row justify-content-center">
                <div className="col-lg-5 all_main p-0">
                  <h3 class="staking__selector__heading site_font">Stake TIPCOIN </h3>

                  <div className="first_box mt-4  px-2">
                    <div className="munt_box d-flex justify-content-between">
                      <span className="site_font">Amount [Min: 1 TIP]</span>
                      <p className="my_balnc site_font ">
                        <span> ~My balance:</span> <span>{balance} </span>
                      </p>
                    </div>
                    <div className="typ_area border ">
                      <div className="mx_buttn str_tp_dollar site_font text-cenetr ">
                        TIP TOKEN
                      </div>
                      <input
                        className="ariia site_font"
                        type="number"
                        inputMode="decimal"
                        placeholder="0"
                        autoComplete="off"
                        autoCorrect="off"
                        aria-aria-valuemin="0"
                        aria-valuemax="9007199254740991"
                        onChange={(e) => setgetValue(e.target.value)}
                        value={getValue}
                      />

                      <button
                        type="button"
                        className="mx_buttn site_font text-white "
                        onClick={() => setgetValue(balance)}
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <div className="second_box mt-3 px-2">
                    <p className="text-start site_font">Locking Time</p>
                    <div className="time_table">
                      <div className="dan_gtr text-white">
                        <div
                          className=" border des_tw p-0 "
                          style={{
                            background:
                              Active == 1
                                ? "linear-gradient(98.76deg, rgb(56, 195, 207) 0%, rgb(135, 103, 211) 100%)"
                                : "#000",
                          }}
                        >
                          <button
                            className="btn btn-md dates"
                            onClick={() => (
                              setselectDays(30),
                              setActive(1),
                              setpercent((getValue * 19.9166666667) / 100)
                            )}
                          >
                            30 Days
                          </button>
                          <div className="arp border-top">239 % APY</div>
                        </div>
                        <div
                          className=" border des_tw p-0"
                          style={{
                            background:
                              Active == 2
                                ? "linear-gradient(98.76deg, rgb(56, 195, 207) 0%, rgb(135, 103, 211) 100%)"
                                : "#000",
                          }}
                        >
                          <button
                            className="btn btn-md dates"
                            onClick={() => (
                              setselectDays(90),
                              setActive(2),
                              setpercent((getValue * 222.5) / 100)
                            )}
                          >
                            90 Days
                          </button>
                          <div className="arp border-top">890 % APY</div>
                        </div>
                        <div
                          className=" border des_tw p-0"
                          style={{
                            background:
                              Active == 3
                                ? "linear-gradient(98.76deg, rgb(56, 195, 207) 0%, rgb(135, 103, 211) 100%)"
                                : "#000",
                          }}
                        >
                          <button
                            className="btn btn-md dates"
                            onClick={() => (
                              setselectDays(180),
                              setActive(3),
                              setpercent((getValue * 1100) / 100)
                            )}
                          >
                            180 Days
                          </button>
                          <div className="arp border-top">2200 % APY</div>
                        </div>
                        <div
                          className=" border des_tw p-0"
                          style={{
                            background:
                              Active == 4
                                ? "linear-gradient(98.76deg, rgb(56, 195, 207) 0%, rgb(135, 103, 211) 100%)"
                                : "#000",
                          }}
                        >
                          <button
                            className="btn btn-md dates"
                            onClick={() => (
                              setselectDays(360),
                              setActive(4),
                              setpercent((getValue * 5800) / 100)
                            )}
                          >
                            360 Days
                          </button>
                          <div className="arp border-top">5800 % APY</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="site_button mt-3"
                    onClick={() => staking_Amount()}
                  >
                    {spinner == true ? (
                      <>
                        <div class="spinner-border" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </>
                    ) : (
                      " Enable Staking"
                    )}
                  </button>

                  <div className="last mt-4">
                    <p className="fon m-0 py-2 site_font">
                      Locking {getValue} TIP COIN for {selectDays} Days, You
                      will get {selectpercent} reward
                    </p>
                  </div>
                </div>
              </div>
            </div>
          
          </>
          {/* // )} */}
        </>
      ) : (
        <>
          <div className="container">
            <div class={cradShow.length > 10 ? "item-details-into" : ""}>
              <div className="row">
                {cradShow.length == 0 ? (
                  <></>
                ) : (
                  <>
                    <div className="btn_selected">
                      <button
                        className="btn end_canvas text-white me-auto"
                        onClick={() => selectAllNFT()}
                      >
                        Select All
                      </button>
                    </div>
                  </>
                )}
                {cradShow?.map((items, index) => {
                  return (
                    <>
                      <div className="col-lg-3 col-md-3 mt-3">
                        <div
                          className={
                            items.selecteddata == true
                              ? "contain game-item disabled"
                              : "game-item"
                          }
                          disabled={true}
                          // class="game-item contain"
                          style={{
                            cursor:
                              items.selecteddata == true
                                ? "default"
                                : "pointer",

                            border:
                              slectedAllnfton.condition == true &&
                              items.selecteddata != true
                                ? "5px solid rgb(56, 195, 207)"
                                : "none",
                          }}
                          id={index}
                          onClick={() => SelectedCard(index, items.tokenid)}
                        >
                          <div class="game-inner">
                            <div class="game-item__thumb">
                              <img
                                src={items.imgurl}
                                alt="game"
                                style={{ zIndex: "100000" }}
                                className="image"
                              />
                              <div class="middle">
                                <div class="text">Staked</div>
                              </div>
                              <div class="game-item__content">
                                <h4 class="title">{items.tokenid}</h4>
                              </div>
                            </div>
                          </div>
                          <div class="mask"> </div>
                          <div class="ball"> </div>
                        </div>
                      </div>
                      {/* <img src={items} alt="" width="100%" className="border" /> */}
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          {/* {acc == null ? (
            <Connent setShoww={setShoww} />
          ) : ( */}
          <>
        
            <div className="container-fluid p-0  mt-5">
              <div className="row justify-content-center">
                <div className="col-lg-5 all_main p-0">
                  <h3 class="staking__selector__heading">Stake TIP COIN</h3>

                  <div className="first_box mt-4  px-2">
                    <div className="munt_box d-flex justify-content-between">
                      <span className="">Amount</span>
                      <p className="my_balnc ">
                        <span> ~My balance:</span> <span>{balance} </span>
                      </p>
                    </div>
                    <div className="typ_area border ">
                      <div className="mx_buttn str_tp_dollar text-cenetr ">
                        TIP COIN 
                      </div>
                      <input
                        className="ariia"
                        type="number"
                        inputMode="decimal"
                        placeholder="0"
                        autoComplete="off"
                        autoCorrect="off"
                        aria-aria-valuemin="0"
                        aria-valuemax="9007199254740991"
                        onChange={(e) => setgetValue(e.target.value)}
                        value={getValue}
                      />

                      <button
                        type="button"
                        className="mx_buttn text-white "
                        style={{ cursor: "pointer" }}
                        onClick={() => setgetValue(balance)}
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <div className="second_box mt-3 px-2">
                    <p className="text-start">Locking Time</p>
                    <div className="time_table">
                      <div className="dan_gtr text-white">
                        <div
                          className=" border des_tw p-0 "
                          style={{
                            background:
                              Active == 1
                                ? "linear-gradient(98.76deg, rgb(56, 195, 207) 0%, rgb(135, 103, 211) 100%)"
                                : "#000",
                          }}
                        >
                          <button
                            className="btn btn-md dates"
                            onClick={() => (setselectDays(30), setActive(1))}
                          >
                            30 Days
                          </button>
                          <div className="arp border-top">239 % APY</div>
                        </div>
                        <div
                          className=" border des_tw p-0"
                          style={{
                            background:
                              Active == 2
                                ? "linear-gradient(98.76deg, rgb(56, 195, 207) 0%, rgb(135, 103, 211) 100%)"
                                : "#000",
                          }}
                        >
                          <button
                            className="btn btn-md dates"
                            onClick={() => (setselectDays(90), setActive(2))}
                          >
                            90 Days
                          </button>
                          <div className="arp border-top">890 % APY</div>
                        </div>
                        <div
                          className=" border des_tw p-0"
                          style={{
                            background:
                              Active == 3
                                ? "linear-gradient(98.76deg, rgb(56, 195, 207) 0%, rgb(135, 103, 211) 100%)"
                                : "#000",
                          }}
                        >
                          <button
                            className="btn btn-md dates"
                            onClick={() => (setselectDays(180), setActive(3))}
                          >
                            180 Days
                          </button>
                          <div className="arp border-top">2200 % APY</div>
                        </div>
                        <div
                          className=" border des_tw p-0"
                          style={{
                            background:
                              Active == 4
                                ? "linear-gradient(98.76deg, rgb(56, 195, 207) 0%, rgb(135, 103, 211) 100%)"
                                : "#000",
                          }}
                        >
                          <button
                            className="btn btn-md dates"
                            onClick={() => (setselectDays(360), setActive(4))}
                          >
                            360 Days
                          </button>
                          <div className="arp border-top">5800 % APY</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="site_button mt-3"
                    onClick={() => staking_Amount()}
                  >
                    {spinner == true ? (
                      <>
                        <div class="spinner-border" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </>
                    ) : (
                      " Enable Staking"
                    )}
                  </button>

                  <div className="last mt-4">
                    <p className="fon m-0 py-2">
                      Locking {getValue} TIPCOIN  for {selectDays} Days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
          {/* )} */}
        </>
      )}
    </>
  );
}

export default Lockestake;
