import React from "react";
import "./Head.css";
import logo from "../../Component/Accets/logo.png";
import Canvas from "../Canvas/Canvas";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useWeb3Modal } from "@web3modal/react";
import Button from "react-bootstrap/Button";
import site_logo from "../Accets/sa_logo.png"
import { MdKeyboardArrowLeft } from "react-icons/md";


import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
function Head({ handleClosee, handleShoww, setShoww, showw }) {
  const { open } = useWeb3Modal();
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const { address } = useAccount();
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="" variant="dark bbor">
        <Container>
          <Navbar.Brand href="#home" className="navBrand">
           <img src={site_logo} className="site_main_logo" alt="" />
          </Navbar.Brand>
          {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {/* <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link> */}
            </Nav>
            <Nav className="navRescenter">
              <Link to="/" style={{ textDecoration: "none" }}>
                {/* <Nav.Link href="/" className="mt-2 text-white">
                  Token STAKING
                </Nav.Link> */}
              </Link>
              <Link to="/Nft_Staking" style={{ textDecoration: "none" }}>
                {/* <Nav.Link href="/Nft_Staking" className="mt-2 text-white">
                  NFT STAKING
                </Nav.Link> */}
              </Link>

            </Nav>
          </Navbar.Collapse>
              <Nav.Link eventKey={2}>
                <Button
                  variant=""
                  onClick={() =>
                    address
                      ? chain?.id == chains[0]?.id
                        ? open()
                        : switchNetwork?.(chains[0]?.id)
                      : open()
                  }
                  className=" new_site_button"
                >
                  {address ? (
                    chain?.id == chains[0]?.id || chain?.id == chains[1]?.id ? (
                      address ? (
                        <>
                          {`${address.substring(0, 6)}...${address.substring(
                            address.length - 4
                          )}`}
                        </>
                      ) : (
                        <>
                          Connect{" "}
                          <MdKeyboardArrowLeft className="icon_canvas" />
                        </>
                      )
                    ) : (
                      "Switch Network"
                    )
                  ) : (
                    <>
                      Connect <MdKeyboardArrowLeft className="icon_canvas" />
                    </>
                  )}
                </Button>
                {/* <Canvas
                  handleClosee={handleClosee}
                  handleShoww={handleShoww}
                  setShoww={setShoww}
                  showw={showw}
                /> */}
              </Nav.Link>
        </Container>
      </Navbar>
    </>
  );
}

export default Head;
