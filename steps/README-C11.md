# Edit Course

## 修改课程基本信息

- 数据准备
  -- api：getCourses，addCourse，updateCourse

1. 查询课程
   -- 选择按照 code，name 或 category 作为 getCourses 的参数查询课程
   -- input 框 debounce
2. 将查询得到的数据保存到 searchResult 中
3. 复用 AddCourse 控件，根据参数 course 决定添加或修改。如添加则表单内容为空，添加成功返回添加数据信息；如修改则传入课程信息，显示在表单中。
4. 表单验证
5. 修改课程信息
6. 给出成功或失败信息

## 修改章节信息及上课时间

- 数据准备
  -- api：updateSchedule

1. 复用 schedule 控件，通过参数 isAdd 决定添加或修改。如添加则表单内容为空；如修改则传入章节及开课信息，显示在表单中。
2. 开课时间选择，排除已选的日期
   -- 使用 Form.List
   -- 用 selectedWeekdays 存放已选的日期和在 Form.List 中的 field 的 key 值。{value,key}
   -- 如修改则在 render 的时候将开课日期作为 value 值，index 作为 key 值保存到 selectedWeekdays 中。
   -- Form.List 的 field 的 onSelect 事件中，根据 field.key 值修改 selectedWeekdays 中相同 key 值对应的 value 值
   -- 删除按钮将 Form.List 的 field 删除的同时删除 selectedWeekdays 中 key 值为 field.key 的项。
3. 修改章节及开课信息
4. 给出成功或失败信息

## 问题

updateSchedule 修改时原有章节信息不删除，只追加新的章节。
