---
title: 使用uTools为你的文章一键生成hexo博客开头
categories: 技术
tags:
  - hexo
  - 博客
  - uTools
cover: 'https://cdn.muyulong.top/image/202108201616182.jpg'
abbrlink: d4a35c0c
date: 2021-08-20 16:11:45
description: 方便 简单 好用
---

{% note info simple %}
本文含有低质量代码，如您感到不适请立即关闭。
{% endnote %}

> [uTools](https://u.tools/) 是一个极简、插件化的现代桌面软件，通过自由选配丰富的插件，打造得心应手的工具集合。

在uTools软件中，有一个官方发布的插件--{% label 自动化助手 blue %}

![自动化助手](https://cdn.muyulong.top/image/202108201623679.png)

使用这个插件就可以在每次写文章之前自动插入hexo博客的开头，而不需要去复制了

打开{% label 自动化助手设置 blue %}，选择{% label 我的自动化 blue %}，点击➕号新建一个新的脚本

粘贴以下的代码

```javascript
var myDate = new Date()
var y = myDate.getFullYear()
var mm = myDate.getMonth()+1
var d = myDate.getDate()
var h = myDate.getHours()
var m = myDate.getMinutes()
var s = myDate.getSeconds()
const date = y+'-'+mm+'-'+d+' '+h+':'+m+':'+s
const title = '---'+'\n'+
              'title: '+'\n'+
              'categories: '+'\n'+
              'tags:'+'\n'+
              '  - '+'\n'+
              'description: '+'\n'+
              'cover: '+'\n'+
              'date: '+date+'\n'+
              '---'
utools.copyText(title)
utools.simulateKeyboardTap('v', utools.isMacOs() ? 'command' : 'ctrl')
```

可以根据实际使用情况进行调整

这里记得设置一个关键字用于触发，然后保存

![关键字](https://cdn.muyulong.top/image/202108201638833.jpg)

在实际使用中，可以通过快捷键打开uTools，然后输入关键字来快速填充内容

当然，也有类似的软件具有差不多的功能，比如[Quicker](https://getquicker.net/)，也是一个不错的工具箱软件，而且已经有了现成的填充方案--[typora写博客开头](https://getquicker.net/sharedaction?code=e8fcf493-4b67-49b1-96c7-08d6ef28204a)，我的脚本也是受这个方案启发而来的。
