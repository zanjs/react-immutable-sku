# react sku-filter

仿淘宝商品属性选择器
基于 ImmutableJS 数据类型的练手
思路是把sku设计成 ```'color:red;size:xl;'```的形式，
将用户选中的属性转换成字符串数组```['color:red', 'size:xl']```，
然后遍历使用正则匹配的方式检索SKU列表

