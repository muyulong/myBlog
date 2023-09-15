---
title: 关于hexo-Sakura主题中播放按钮的一点改进
categories: 技术
tags:
  - hexo
  - 博客
keywords: hexo-sakura
description: 并没有什么卵用。。
cover: 'https://cdn.muyulong.top/image/sakura.png'
abbrlink: 37ef2584
date: 2020-06-04 17:25:15
---

{% note warning simple %}
这是一篇早期的教程文章，里面的内容可能已经过时或废弃，请注意甄别。
{% endnote %}

发现hexo-Sakura主题中首页的右下角有一个播放按钮。

![png](https://cdn.muyulong.top/image/20200607173620.png)
点击按钮之后就可以播放一个视频，看着这个按钮我总觉得少点什么，于是我决定给它加一个全屏功能。

### 绘制图标

首先打开一个像素绘图软件，这里我用的是ArtCursors，为了能够绘制出和原版一样风格的按钮，我载入了原版的图标
![png](https://cdn.muyulong.top/image/20200607174527.png)

擦除中间的图案，然后使用吸管吸取主颜色，绘制出图标后另存为`full-32x32.png`备用

![png](https://cdn.muyulong.top/image/20200607174736.png)

### 主题修改

#### JavaScript功能

打开Sakura主题根目录，打开`source\js`,新建一个`fullscreenElement.js`文件，代码如下

```javascript
//从网上随便抄了点代码改了改
function $(Nid){
 return document.getElementById(Nid);
}
    // 进入全屏：
    function entryFullScreen() {
        var docE = document.documentElement;
        if (docE.requestFullScreen) {
            docE.requestFullScreen();
        } else if (docE.mozRequestFullScreen) {
            docE.mozRequestFullScreen();
        } else if (docE.webkitRequestFullScreen) {
            docE.webkitRequestFullScreen();
        }
    }
    // 退出全屏
    function exitFullScreen() {
        var docE = document;
        if (docE.exitFullscreen) {
            docE.exitFullscreen();
        } else if (docE.mozCancelFullScreen) {
            docE.mozCancelFullScreen();
        } else if (docE.webkitCancelFullScreen) {
            docE.webkitCancelFullScreen();
        }
    }
    /*全屏操作的主要方法和属性
    * 1.requestFullScreen():开启全屏显示
    *   不同浏览器需要添加不同的前缀
    *   chrome:webkit   firefox:moz   ie:ms   opera:o
    * 2.cancelFullScreen():退出全屏显示:也添加前缀，在不同的浏览器下.退出全屏只能使用document来实现
    * 3.fullScreenElement:是否是全屏状态，也只能使用document进行判断*/
    window.onload=function(){
        var div=document.querySelector("div");
        /*添加按钮的点击事件*/
        /*判断是否是全屏状态*/
        document.querySelector("#video-full").onclick=function(){
            var fullscreenElement =
                document.fullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement;
            if (fullscreenElement == null) {
                entryFullScreen();
            } else {
                exitFullScreen();
            }
        }
    }
```

#### ejs布局

找到`layout\_partial\headertop.ejs`这个文件，在id为`video-container`这个div中添加一个新的按钮，代码如下

```html
<div id="video-full">
</div>
<script type="text/javascript" src="/js/fullscreenElement.js"></script>
```

#### css样式

打开`source\css\style.css`，为这个全屏按钮添加样式，代码如下

```css
#video-full {
    background-image:url('cdn.muyulong.top/image/full@32x32.png');
    bottom:90px;
    display:none
}
```

如果你不想把css变得一团糟，那么关于播放功能的部分大概在1100行左右;-）

### 注意事项

`sakura-app.js`这个文件里面貌似要加一行内容
![png](https://cdn.muyulong.top/image/202108200127915.png)
另外，我发现只要做好url的拼接，大部分支持外链的视频都可以作为背景视频
![png](https://cdn.muyulong.top/image/202108200128010.png)

![png](https://cdn.muyulong.top/image/0a0272a146a632bb1cbd43998493085a.jpg)
