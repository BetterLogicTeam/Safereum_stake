import React, { useEffect, useState } from "react";
import "./Total_value.css";
import Tab from "../Tab/Tab";
import { Staking, Staking_Abi, tokenStaking, tokenStaking_Abi, ARBStaking,
  ARBStaking_Abi,  ARBtoken,
  ARBtoken_Abi } from "../../utilies/constant";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
function Total_value({setShoww}) {
  const { address } = useAccount();
 
  
  const [totalUserAmount, settotalUserAmount] = useState(0)
  const [WithdrawReward, setWithdrawReward] = useState(0)

  const TotalAmount =async()=>{
    try{
      const webSupply = new Web3(
        "https://ethereum.publicnode.com"
    );


    let stakingContractOf = new webSupply.eth.Contract(ARBStaking_Abi, ARBStaking);

    if (address) {


        let UserInformation = await stakingContractOf.methods
            .Users(address)
            .call();
            console.log("Users",UserInformation.DepositeToken);

           let UserInformationdata=webSupply.utils.fromWei(UserInformation.DepositeToken)
           let WithdrawableAmount = await stakingContractOf.methods.pendingRewards(address).call();
            WithdrawableAmount=webSupply.utils.fromWei(WithdrawableAmount)


           setWithdrawReward(parseFloat(WithdrawableAmount).toFixed(3))
            settotalUserAmount(UserInformationdata)
    }


    }catch(e){

    }
  }

  useEffect(() => {
    TotalAmount()
  })


  return (
    <div className="">
      <div
        class="chakra-stat css-16fwhjm"
        style={{
          padding: "1rem 2rem 0.5rem",
          width: "max-content",
          minWidth: "265px",
          margin: "1rem auto",
         
         height:"8rem"
        }}
      >
        <dl>
          <dt class="chakra-stat__label css-1mqe0od">Total Value Locked</dt>
          <dd class="chakra-stat__number css-1snxiwx">
            <p class="chakra-text  css-0 text-white">{totalUserAmount} TIPCOIN </p>
          </dd>
          
          <div class="chakra-stat__label css-1mqe0od " style={{marginTop:"-1rem"}}>
            <p class="chakra-stat__label css-1mqe0od"> WithdrawAble Reward <br/>
             {WithdrawReward} TIP COIN </p>
          </div>
        </dl>
      </div>

      <div className="container">
        <div className="row  text-white">
          <div className="text-center m-auto">
            <Tab setShoww={setShoww} totalUserAmount={totalUserAmount} selectedCard="one"  />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Total_value;
