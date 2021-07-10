import { Affix, Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import storage from "../../shared/storage";

const SignIn = styled.li`
  @media screen and (min-width: 700px) {
    position: fixed;
    right: 6em;
  }
`;

const HeaderWrapper = styled.div`
  width: 100%;
  height: 100px;
  margin: 0 auto;
  float: center;
`;

const MenuItemWrapper = styled.span`
  height: 100px;
  display: flex;
  align-items: center;
  font-size: 21px;
  color: #8c929c;
  font-family: "BebasNeue";
  color: ${(props) => (props.current ? "#008bc4" : "#8c929c")} !important;
  text-decoration: ${(props) => (props.current ? "underline" : "none")};
`;

export default function Header() {
  const [current, setCurrent] = useState("");
  const router = useRouter();
  const isEvents = router.pathname.match(/events/i);
  const isGallery = router.pathname.match(/gallery/i);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const userInfo = storage.userInfo;
    if (!!userInfo) setIsLogin(true);
  }, []);

  const handleClick = (e: any) => {
    setCurrent(e.key);
  };
  return (
    <HeaderWrapper>
      <Affix offsetTop={0}>
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key="courses">
            <MenuItemWrapper current={isGallery}>Courses</MenuItemWrapper>
          </Menu.Item>
          <Menu.Item key="events">
            <MenuItemWrapper current={isEvents}>Events</MenuItemWrapper>
          </Menu.Item>
          <Menu.Item key="students">
            <MenuItemWrapper current={isGallery}>Students</MenuItemWrapper>
          </Menu.Item>
          <Menu.Item key="teachers">
            <MenuItemWrapper current={true}>Teachers</MenuItemWrapper>
          </Menu.Item>
          <SignIn>
            <MenuItemWrapper current={isLogin}>
              {isLogin ? (
                <Link href={`/dashboard/${storage.role}`}>Dashboard</Link>
              ) : (
                <Link href="/auth">Sign in</Link>
              )}
            </MenuItemWrapper>
          </SignIn>
        </Menu>
      </Affix>
    </HeaderWrapper>
  );
}
