# Student Table

## Add student button

1. 点击显示添加 student Form
   - form 验证
2. api/student 的 post 方法
   - type 定义
   - api 调用
3. 添加结果显示
   - 成功重新显示添加后的 table 数据
   - 失败给出错误信息

## Search by name button

- Input.Search button
- debounce 效果
- api/student 的 get 方法在原有参数基础上添加 query 参数

## Edit student

1. 点击显示编辑 student Form

- 所需参数：student 的基本信息
- 可与添加共用一个 form，需要将当前 student 的数据放入 form 中

2. api/student 的 put 方法
   - type 定义
   - api 调用
3. 添加结果显示
   - 成功重新显示编辑后的 table 数据
   - 失败给出错误信息

## Delete student

1. 确认删除
2. 所需参数：student 的 Id
3. api/student 的 delete 方法
   - type 定义
   - api 调用
4. 添加结果显示
   - 成功重新显示删除后的 table 数据
   - 失败给出错误信息

## Table Pagination

设置 pagination 的 config 信息，包括

- current
- pageSize
- total
- showSizeChanger
- showTotal
- onChange
- onShowSizeChange

## Sort

- add sort function on the field

## Filter

- add filter function on the field

# 问题：
