# Teacher

## 数据准备

- getTeachers
- addTeacher
- updateTeacher
- deleteTeacher
- getTeacherById

## Teacher 列表

- 用 useListEffect 取得教师数据并保存
- AddEditTeacher 控件，form 中列出添加教师需要的信息，调用 addTeacher 添加教师。
- 指定 TeacherTable 每列对应的数据
- Action 动作，当修改时传入 id 及需要修改的内容，调用 updateTeacher 修改教师信息；删除时传入 id，显示确认框，如确认删除则调用 deleteTeacher 删除该教师信息。

## Teacher Detail

- 根据传入的参数及路由信息获得教师 id
- 调用 getTeacherById 得到教师详细信息
- 将详细信息显示在页面上

## 问题

@fieldMap
