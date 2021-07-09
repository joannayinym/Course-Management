import React from "react";
import styled from "styled-components";
import Header from "../components/header";
import HomeCarousel from "../components/main/homeCarousel";

const HeaderWrapper = styled.div`
  position: relative;
  width: 1200px;
  height: 200px;
`;

export default function Homepage() {
  return (
    <>
      <Header />
      <HomeCarousel />
      <HeaderWrapper />
    </>
  );
}
