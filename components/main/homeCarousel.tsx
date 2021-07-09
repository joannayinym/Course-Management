import React from "react";
import { Carousel } from "antd";
import styled from "styled-components";

const Slide = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  background: url(../images/pic_slide.jpg) no-repeat 50% 50%;
  background-size: cover;
  height: 600px;
`;
const SlideCoverTop = styled.div`
  background: url(../images/bg_white_arrow.png) no-repeat 50% 50%;
  height: 30px;
  margin-top: 0;
  padding-top: 0;
`;

const SlideCoverBottom = styled.div`
  background: url(../images/bg_white.png) no-repeat 50% 50%;
  background-size: cover;
  height: 30px;
`;

const SlideContentWrapper = styled.div`
  height: 540px;
`;

const SlideContent = styled.div`
  float: right;
  padding: 50px 150px 0 0;
  text-transform: uppercase;
  @media screen and (max-width: 1280px) {
    padding: 50px 100px 0 0;
  }
  @media screen and (max-width: 768px) {
    padding: 50px 15px 0 0;
  }
`;

const SlideContentH2 = styled.h2`
  color: #fff;
  font-family: "BebasNeue";
  font-weight: 300;
  font-size: 72px;
  line-height: 84px;
  padding-bottom: 110px;
  text-align: left;
  @media screen and (max-width: 1280px) {
    font-size: 60px;
    line-height: 72px;
  }
  @media screen and (max-width: 768px) {
    line-height: 56px;
    font-size: 40px;
  }
  @media screen and (max-width: 500px) {
    font-size: 30px;
    line-height: 40px;
  }
`;

const SlideContentSpan = styled.span`
  color: #fff;
  font-family: "BebasNeue";
  font-weight: 700;
  font-size: 84px;
  line-height: 101px;
  border-radius: 4px;
  background: #008bc4;
  padding: 1px 23px 5px 23px;
  display: inline-block;
  @media screen and (max-width: 120px) {
    font-size: 64px;
    line-height: 72px;
  }
  @media screen and (max-width: 768px) {
    font-size: 48px;
    line-height: 54px;
  }
  @media screen and (max-width: 500px) {
    font-size: 30px;
    line-height: 40px;
  }
`;

const SlideContentA = styled.a`
  color: #fff;
  font-family: "BebasNeue";
  font-size: 40px;
  line-height: 48px;
  font-weight: 300;
  padding-right: 63px;
  background: url(../images/bg_arrow.png) no-repeat 100% 50%;
  @media screen and (max-width: 120px) {
    font-size: 32px;
    line-height: 36px;
  }
  @media screen and (max-width: 768px) {
    font-size: 28px;
    line-height: 32px;
  }
  @media screen and (max-width: 500px) {
    font-size: 24px;
    line-height: 28px;
  }
`;

export default function HomeCarousel() {
  return (
    <>
      <ul style={{ paddingInlineStart: 0 }}>
        <Carousel autoplay>
          {[1, 2, 3].map((item) => (
            <li key={item}>
              <Slide>
                <SlideCoverTop />
                <SlideContentWrapper>
                  <SlideContent>
                    <SlideContentH2>
                      It’s Time to <br />
                      <SlideContentSpan>Get back to school</SlideContentSpan>
                    </SlideContentH2>
                    <SlideContentA>
                      <a href="#">Check out our new programs</a>
                    </SlideContentA>
                  </SlideContent>
                </SlideContentWrapper>
                <SlideCoverBottom />
              </Slide>
            </li>
          ))}
        </Carousel>
      </ul>
    </>
  );
}
