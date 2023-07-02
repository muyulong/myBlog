---
title: 语雀+coding+腾讯云函数打造云端写作，自动部署的hexo博客
categories: 技术
tags:
  - hexo
  - 教程
  - 博客
keywords: coding 语雀 hexo
description: 这样就能好好写博客了吗？
cover: 'https://cdn.mmyyll.ml/image/20200604171935.png'
abbrlink: 1ae85bf0
date: 2020-06-09 17:21:02
---

{% note warning simple %}
这是一篇早期的教程文章，里面的内容可能已经过时或废弃，请注意甄别。
{% endnote %}

## 这是什么？
这是一个方案，能够让你在语雀平台上进行云端写作，并且自动部署到你的静态博客中。
参考教程：
[Hexo 博客终极玩法：云端写作，自动部署](https://segmentfault.com/a/1190000017797561)
[Hexo：语雀云端写作 Coding 持续集成实现自动部署](https://www.yuque.com/jideanshichifan/hexo/zy4wle)
#### 原理

- coding持续集成编译博客源码构建静态文件
- 使用腾讯云函数调用coding构建的api
- 语雀的webhook功能调用腾讯云的函数调用
## 语雀是什么？
> [百度百科](https://baike.baidu.com/item/%E8%AF%AD%E9%9B%80/24190957)：语雀，是阿里内部孵化的一款文档与知识管理工具。语雀使用了“结构化知识库管理”，形式上类似书籍的目录。与其他产品可以随意建立文档不同，语雀上的每一篇文档必须属于某一个知识库，语雀希望通过这样的产品设计，来从源头上帮助用户建立起知识管理的意识，培养良好的知识管理习惯。

简单的说，语雀就是阿里推出的一个结构化管理的云端写作的平台，在这个平台上用户可以自由地创建管理文档。
## 怎么配置？
#### coding上遇到的一些坑
在coding上实现hexo的自动化部署可以参考[这篇文章](https://yuxihan.com/20191212.html)
简单来说就是把原本存放在本地的hexo放到了coding上，并且使用了coding的服务器来完成编译、提交等操作。
关于coding上的持续集成也可以参考官方的[文章](https://zhuanlan.zhihu.com/p/55975297)
下面是我自己的pipeline，仅供参考
```groovy
pipeline {
  agent {
    docker {
      image 'lenyuadmin/hexo'
    }

  }
  stages {
    stage('检出') {
      steps {
        checkout([$class: 'GitSCM', branches: [[name: env.GIT_BUILD_REF]], userRemoteConfigs: [[url: env.GIT_REPO_URL, credentialsId: env.CREDENTIALS_ID]]])
      }
    }
    stage('环境') {
      steps {
        echo '构建中...'
		sh 'npm install -g cnpm --registry=https://registry.npm.taobao.org'
        sh 'cnpm install'
		sh 'npm run clean:yuque'
		sh 'npm run sync'
        sh 'hexo -v'
        echo '构建完成.'
      }
    }
    stage('生产') {
      steps {
        echo '生产中...'
        sh 'hexo clean'
        sh 'hexo g'
        echo '生产完成.'
      }
    }
    stage('部署') {
      steps {
        echo '部署中...'
        dir(path: 'public') {
          sh 'ls'
          sh 'git init'
          sh 'git config user.name $USER_NAME'
          sh 'git config user.email $USER_EMAIL'
          sh 'git config --global user.name $USER_NAME'
          sh 'git config --global user.email $USER_EMAIL'
          sh 'git add -A'
          sh 'git commit -m \'init\''
          sh 'git push -u -f "$USER_PROJECT" master:master'
        }

        echo '部署完成'
      }
    }
  }
}
```
需要注意的是，如果你使用我的pipeline，那么记得要添加环境变量
![](https://cdn.mmyyll.ml/image/202108200033047.png)

#### 腾讯云函数那些事
云函数就是做为一个trigger来被语雀调用的，所以放在哪个平台都无所谓，腾讯和阿里的云函数的免费额度都够用了，哪个用着顺手用哪个
首先新建一个云函数
![](https://cdn.mmyyll.ml/image/202108200033324.png)
下面贴一下我的云函数代码

```python
# -*- coding: utf8 -*-
import requests

def main_handler(event, context):


    url = "" # 这个url再coding自动构建的触发规则>API触发那里复制过来

    payload = {"ref": "master","envs": []}
    headers = {
    'Content-Type': 'application/json',
    }
    # coding的api触发用到是http basic auth验证，这里的用户密码也去coding的项目token拷贝
    # 开发者选项-项目令牌，如果没有就新建，仓库权限全勾上
    response = requests.post( url, headers=headers, json = payload,auth=('你的令牌用户名','令牌密码'))

    return response.text
```
之后新建一个触发器，触发方式选择api网关触发就行了
![](https://cdn.mmyyll.ml/image/202108200034151.png)
创建完触发器之后，会得到一个访问路径
![](https://cdn.mmyyll.ml/image/202108200034474.png)

#### 在语雀上写文章
首先需要新建一个知识库，然后在设置里面添加webhook，填入刚刚得到的访问路径
![](https://cdn.mmyyll.ml/image/202108200034171.png)
另外，在hexo中同步语雀上的文章是通过[yuque-hexo](https://github.com/x-cold/yuque-hexo)这个插件实现的，关于TOKEN的配置和package.json文件的配置x-cold大佬都写得清楚了，我就不多赘述了。
## 还有什么？
#### 针对hexo-theme-sakura主题的一些改进
因为我的博客使用的主题是[hexo-theme-sakura](https://github.com/honjun/hexo-theme-sakura)，yuque-hexo这个插件里面自带的front-matter适配有一些问题，所以我自己添加了一个配置文件，代码如下
```javascript
'use strict';

const ejs = require('ejs');
const Entities = require('html-entities').AllHtmlEntities;
const FrontMatter = require('hexo-front-matter');
const { formatDate, formatRaw, formatTags } = require('../util');

const entities = new Entities();



/**
 * front matter 反序列化
 * @description
 * docs: https://www.npmjs.com/package/hexo-front-matter
 *
 * @param {String} body md 文档
 * @return {String} result
 */
function parseMatter(body) {
  body = entities.decode(body);
  try {
    // front matter信息的<br/>换成 \n
    const regex = /(---|title:|layout:|tags:|date:|categories:){1}(\S|\s)+?---/gi;
    body = body.replace(regex, a => a.replace(/(<br \/>|<br>|<br\/>)/gi, '\n'));
    const result = FrontMatter.parse(body);
    result.body = result._content;
    if (result.date) {
      result.date = formatDate(result.date);
    }
    delete result._content;
    return result;
  } catch (error) {
    return {
      body,
    };
  }
}

/**
 * hexo 文章生产适配器
 *
 * @param {Object} post 文章
 * @return {String} text
 */
module.exports = function(post) {
  // matter 解析
  const parseRet = parseMatter(post.body);
  const { body, ...data } = parseRet;
  const { title, slug: urlname, created_at } = post;
  const raw = formatRaw(body);

  const text = ejs.render(
    raw,
  );
  return text;
};
```
实测以上代码可以完美适配hexo-theme-sakura主题，如果想使用的话复制代码另存为
另存为`hexo-Sakura.js`，放在`\yuque-hexo-Sakura\adapter`中，同时修改`package.json`文件中的`adapter`为`hexo-Sakura`。
#### 为什么使用coding？
因为网络问题，GitHub时不时抽风，而且coding的持续集成确实好用。。

