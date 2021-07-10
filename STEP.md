#dashboard

##navbar
-logo -折叠按钮
-logout icon button
--[1] 调用 logout API "api/logout"
--[2] 清除 localStorage 和 state 信息
--[3] 跳转到 homepage "/"

##sidebar
-student
--跳转到 student 页面 "/student"
--[1].调用 API 读取 student 数据
--[2].用 antd Table 显示数据信息
--[3].显示在 content 区域

##content

-根据 sidebar 的选择显示相应内容

#问题：
-inspect 窗口有警告，暂时还没清楚原因

-总体框架设计思路
--hooks 设计
--哪些函数需要提取出来

```

```
