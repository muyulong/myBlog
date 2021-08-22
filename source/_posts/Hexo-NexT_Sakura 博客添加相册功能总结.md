---
title: Hexo-NexT/Sakura 博客添加相册功能总结
categories: 技术
tags:
  - 教程
  - 博客
  - hexo
keywords: hexo
description: 2020年3月6日更新！！
cover: 'https://s2.ax1x.com/2020/03/07/3j0sTx.png'
abbrlink: '80145523'
date: 2018-12-13 18:01:02
---
{% note warning simple %}
这是一篇早期的教程文章，里面的内容可能已经过时或废弃，请注意甄别。
{% endnote %}

想要在自己的博客里添加一个相册功能，可以放一些照片进去展示。

当时我使用的是[hexo-NexT](https://github.com/theme-next/hexo-theme-next)主题，所以所有的操作都是在这个主题下完成的。
但是当我将博客的主题换成[hexo-Sakura](https://github.com/honjun/hexo-theme-sakura)时，我需要再次添加这个功能。
# hexo-NexT
以下，是在[hexo-NexT](https://github.com/theme-next/hexo-theme-next)主题下的操作过程。

参考的教程链接：
https://www.sunhome.org.cn/2018/09/29/hexophotos/
https://asdfv1929.github.io/2018/05/26/next-add-photos/

看过上面的教程后，我们总结一下：
1.在博客根目录的 `/scripts/ `文件夹下新建一个` phototool.js `文件

```
"use strict";
    const fs = require("fs");
    const sizeOf = require('image-size');
    //本地照片所在目录
    const path = "source/photos/images"; 
    //要放置生成的照片信息文件目录，建议直接放在 source/photos/ 文件夹下
    const output = "source/photos/photoslist.json";
    var dimensions;
    fs.readdir(path, function (err, files) {
        if (err) {
            return;
        }
        let arr = [];
        (function iterator(index) {
            if (index == files.length) {
                fs.writeFileSync(output, JSON.stringify(arr, null, "\t"));
                return;
            }
            fs.stat(path + "/" + files[index], function (err, stats) {
                if (err) {
                    return;
                }
                if (stats.isFile()) {
                    dimensions = sizeOf(path + "/" + files[index]);
                    console.log(dimensions.width, dimensions.height);
                    arr.push(dimensions.width + '.' + dimensions.height + ' ' + files[index]);
                }
                iterator(index + 1);
            })
        }(0));
    });
```
2.在 `/themes/next/source/js/src/` 目录下创建一个` photo.js`，内容如下：
```
 photo ={
    page: 1,
    //offset 用于设置照片数量的上限
    offset: 100,
    init: function () {
        var that = this;
        //这里设置的是刚才生成的 json 文件路径
        $.getJSON("/photos/photoslist.json", function (data) {
            that.render(that.page, data);
            //that.scroll(data);
        });
    },
    render: function (page, data) {
        var begin = (page - 1) * this.offset;
        var end = page * this.offset;
        if (begin >= data.length) return;
        var html, imgNameWithPattern, imgName, imageSize, imageX, imageY, li = "";
        for (var i = begin; i < end && i < data.length; i++) {
           imgNameWithPattern = data[i].split(' ')[1];
           imgName = imgNameWithPattern.split('.')[0]
           imageSize = data[i].split(' ')[0];
           imageX = imageSize.split('.')[0];
           imageY = imageSize.split('.')[1];
           //这里 250 指的是图片的宽度，可以根据自己的需要调整相册中照片的大小
            li += '<div class="card" style="width:250px">' +
                    '<div class="ImageInCard" style="height:'+ 250 * imageY / imageX + 'px">' +
                    //href 和 src 的链接地址是相册照片外部链接，也可以放博客目录里
                      '<a data-fancybox="gallery" href="/photos/images/' + imgNameWithPattern + '?raw=true" data-caption="' + imgName + '">' +
                        '<img src="/photos/images/' + imgNameWithPattern + '?raw=true"/>' +
                      '</a>' +
                    '</div>' +
                    // '<div class="TextInCard">' + imgName + '</div>' +  //图片下显示文件名作为说明的功能
                  '</div>'
        }
        $(".ImageGrid").append(li);
        $(".ImageGrid").lazyload();
        this.minigrid();
    },
    minigrid: function() {
        var grid = new Minigrid({
            container: '.ImageGrid',
            item: '.card',
            gutter: 12
        });
        grid.mount();
        $(window).resize(function() {
           grid.mount();
        });
    }
}
photo.init();
```
`minigrid.min.js` 可以 [下载](https://unpkg.com/minigrid@3.1.1/dist/minigrid.min.js) 获得，放在同样的目录下。
然后如果指向让两个文件在相册页加载，需要修改 `/themes/next/layout/_scripts/commons.swig`为以下内容，这里的判断语句表示如果页面的类型是 `picture `就加载` minigrid.min.js` 和 `photo.js`
```
{% if page.type ==='picture' %}
{%
  set js_commons = [
    'src/utils.js',
    'src/motion.js',
    'src/minigrid.min.js',
    'src/photo.js',
    'src/canvasline.js'
  ]
%}
{% else %}
{%
  set js_commons = [
    'src/utils.js',
    'src/motion.js',
    'src/canvasline.js'
  ]
%}
{% endif %}

{% for common in js_commons %}
  <script type="text/javascript" src="{{ url_for(theme.js) }}/{{ common }}?v={{ version }}"></script>
{% endfor %}
```
3.在`/themes/next/source/css/_custom/custom.styl`添加以下内容
```
//相册样式
.ImageGrid {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  text-align: center;
}

.card {
  overflow: hidden;
  transition: .3s ease-in-out;
  border-radius: 8px;
  background-color: #ddd;
}

.ImageInCard img {
  padding: 0 0 0 0;
  border-radius: 8px;
}
```
4.开启 `lazyload `和 `fancybox`
`Hexo-lazy-image `使用
安装步骤：
`npm install hexo-lazyload-image --save`

然后修改` _config.yml `文件
```
lazyload:
  enable: true
  onlypost: false
  loadingImg: # eg. ./images/loading.png
```
安装`fancybox`
```
$ cd themes/next
$ ls
bower.json  _config.yml  docs  gulpfile.coffee  languages  layout  LICENSE.md  package.json  README.md  scripts  source  test
```
输入
```
$ git clone https://github.com/theme-next/theme-next-fancybox3 source/lib/fancybox
```
在主题配置文件`_config.yml`里编辑：
```
fancybox: true
```
4.相册文件夹
` hexo/source/ `下建立` photos `文件夹,里面新建index.md文件，添加
```
---
title: photos
date: xxxx-xx-xx xx:xx:xx//自己编辑
type: picture
---
<div class="ImageGrid"></div>
```
在博客根目录的配置文件里启用`post_asset_folder`
```
post_asset_folder: true
```

之后，添加照片，` hexo d -g `就能在自己的博客里看到了。
总结完毕

# hexo-Sakura
与NexT主题不同，Sakura主题使用了[EJS](https://ejs.bootcss.com/)引擎，这使得上面的部分代码需要做一些修改。

与之前的步骤相同，在博客根目录的 `/scripts/ `文件夹下新建一个` phototool.js `文件。

` phototool.js `文件中的路径部分需要填写正确，否则会报错/无法访问。

` minigrid.min.js` 和 `photo.js`这两个文件需要放置在` /themes/Sakura/source/js/ `目录中，且`photo.js`中关于文件路径的部分需配置正确。

在` /themes/Sakura/source/css `目录中新建` pictures.css `，写入以下内容
```
//相册样式
.ImageGrid {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  text-align: center;
}

.card {
  overflow: hidden;
  transition: .3s ease-in-out;
  border-radius: 8px;
  background-color: #ddd;
}

.ImageInCard img {
  padding: 0 0 0 0;
  border-radius: 8px;
}
```
开启 `lazyload `
git bash中输入`npm install hexo-lazyload-image --save`

然后修改` _config.yml `文件
```
lazyload:
  enable: true
  onlypost: false
  loadingImg: # eg. ./images/loading.png
```
由于Hexo-Sakura自带了fancybox，所以无需再次安装。

在` hexo/source/ `目录下建立` pictures `文件夹,里面新建index.md文件，添加
```
---
title: Gallery
date: xxxx-xx-xx xx:xx:xx//自己编辑
layout: pictures
comments: false
---
```
在` /themes/Sakura/source/layout `目录中新建` pictures.ejs `，写入以下内容
```
<link rel="stylesheet" href="/css/pictures.css">
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<div class="pattern-center-blank"></div>
<div id="content" class="site-content">
  <article class="post-item post-301 page type-page status-publish has-post-thumbnail hentry">
    <header class="page-header"><h1 class="cat-title">图集 | 相册</h1> <span class="cat-des"><p>这里将是永远的回忆</p> </span></header>
	<div class="ImageGrid"></div>
	<script type="text/javascript" src="/js/minigrid.min.js" charset="utf-8"></script>
	<script type="text/javascript" src="/js/photo.js" charset="utf-8"></script>
  </article>
</div>
```
最后，在博客根目录的配置文件里启用`post_asset_folder`
```
post_asset_folder: true
```
添加照片，` hexo d -g `就能看到图片了