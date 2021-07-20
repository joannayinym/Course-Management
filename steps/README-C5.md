# Student Detail

## 数据准备

- 定义 StudentProfile, Courses type
- getStudentById api

## 页面显示

- 接收路由参数
- 调用 getStudentById 取得数据
- 使用 antd 控件显示：Card, Row, Col, Tab， Table

# BreadCrumb

- 目前只涉及 dashboard 后面最多三级
- 取路由数据放入数组
- 根据数组元素个数进行一，二三级匹配
- 确定链接及显示文字

# 问题：

- 从 student detail 回到 student 时 Terminal 显示路由数据和 Inspect 窗口显示不一样，正在找原因

1. Terminal：
   pathInfo: [
   { href: '/dashboard/undefined', label: 'CMS(undefined)' },
   { href: '/dashboard/manager/students', label: 'Student' }
   ]
2. Inspect：
   pathInfo:  
   0:
   href: "/dashboard/manager"
   label: "CMS(MANAGER)"
   1:
   href: "/dashboard/manager/students"
   label: "Student"
