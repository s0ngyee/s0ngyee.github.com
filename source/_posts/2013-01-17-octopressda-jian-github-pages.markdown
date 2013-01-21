---
layout: post
title: "Octopress搭建github pages"
date: 2013-01-17 17:21
comments: true
categories: Octopress
tags: Octopress Ruby Github
---
折腾一天终于有所进展了。<br />
看了N篇blog，相关联的知识也找了不少磕磕绊绊的。<br />
写篇日志总结一下，文思如尿路，给自己看，不奢求写的有多流畅有多完美。

<!-- more -->
### 简介
[Octopress](http://octopress.org/)是使用Ruby语言编写的建立在jekyll上的一套blog系统。

优点:<br />
使用[markdown](http://zh.wikipedia.org/wiki/Markdown)标记语言编写文章。<br />
与git集成，通过git对blog进行维护。<br />
可以与github pages进行集成，将个人blog免费托管在github上。<br />

个人缺乏相关知识:<br />
没有接触ruby及相关运行环境，对gem, rake, bundle等工具或类库没有概念。<br />
github没有实际做过代码托管。<br />

### Ruby

#### 安装
一开始采用源码编译的方式进行安装，之后发现无法解析yml文件，编译时忘记加入依赖类库的。惰性使然没有去找依赖类库重新编译，同学推荐rvm的方式来进行安装和管理，果断换一种方式。

#### RVM
安装RVM

``` bash
$ bash -s stable < <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer)
```

安装Ruby

``` bash
rvm install 1.9.3 && rvm use 1.9.3
```
#### Gem
RubyGems（简称 gems）是一个用于对 Rails 组件进行打包的 Ruby 打包系统。 它提供一个分发 Ruby 程序和库的标准格式，还提供一个管理程序包安装的工具。

详细介绍参阅了[这篇](http://lanvige.iteye.com/blog/804477)

#### Bundle
octopress安装过程中有用到bundle命令，顺便提一下bundle是用来管理项目中所有gem的依赖
Gem介绍中对bundle也有说明

#### Rake

简单而言，Rake是一个由ruby编写的build工具。
 
Rake是由ruby实现的，它的rakefile完全是由ruby语法定义的，所以它是一种内部DSL--基于另一种语言（宿主语言）编写的DSL。

参见[这里](http://rails-weekly.group.iteye.com/group/wiki/1830-rails-questions-weekly-15-rake)

*****

### github
需要安装git，这里使用Mountain Lion内置的。

在本机生成ssh key，按着github上的[help](https://help.github.com/articles/generating-ssh-keys)做的，将公钥加入github的帐户中。

在github上[创建](https://github.com/new)一个版本库，因为后面要将octopress和github pages进行集成，版本库名称应为username.github.com


*****

### Octopress
#### 安装
*   获取源码
``` bash
git clone git://github.com/imathis/octopress.git octopress
ruby --version  //Ruby的版本需要在1.9.2版本以上
```

*   安装依赖插件
``` bash
gem install bundler
bundle install
```

*  安装主题
``` bash
rake install
```

*  配置blog
参见[这里](http://octopress.org/docs/configuring/)

*  配置github分支
``` bash
rake setup_github_pages
```
执行后会提示输入git的URL，输入刚才建立的git地址
``` bash
git@github.com:username/username.github.com.git
```

#### 发表文章
``` bash
rake new_post['post name']
```
在source/_post目录下会根据当前日期生成相应的目录以及文章的.markdown文件，使用markdown语言对文章内容进行编辑。

#### 生成预览
``` bash
rake generate
rake preview
```
就可以在本地[http://localhost:4000](http://localhost:4000)预览了。

#### 提交
最后使用以下命令将blog内容提交到github上。
``` bash
rake deploy
```

#### 提交源码
上一步完成以后，_deploy里的blog内容已经提交到了github上，并可以通过github pages进行访问了。此时本地git分支也会自动切换到source分支，最后将blog源码也提交到github上方便以后维护。
``` bash
git add .
git commit -m 'commit message'
git push origin source
```
至此octopress基本功能部署完成，接下来就是对blog进行customize，目前为止就整了两个部分，如下所示。

#### 个性化域名

想使用custom domain来替换原来的s0ngyee.github.com，依照教程所做的在根目录下创建CNAME文件内容为customize domain，可用以下命令进行创建
``` bash
echo 'your-domain.com' >> source/CNAME
```

然后在域名服务器上将二级域名指向到207.97.227.245，等域名服务器刷新便可以了。

*****

### 插件及模板修改

现在还缺少友情链接，文章评论的功能，关于的页面尚未完成。如有修改会及时进行记录。

#### 分类列表
主要步骤如下

* 编写基于Jekyll的插件，并在模板引擎中注册分类标签类，本人不懂ruby就看了个大概。
* 在边栏引用目录中添加新的边栏模板文件
* 修改配置文件边栏项

详细参见[这篇](http://codemacro.com/2012/07/18/add-category-list-to-octopress/)

#### 微博分享
今天在文章结尾处添加了微博分享的功能，照[葫芦](http://programus.github.com/blog/2012/03/04/share-weibo-button/)画瓢跟着做。去新浪微博[分享按钮](http://open.weibo.com/sharebutton)，生成按钮代码（最终是获取document.write里的那一段iframe代码）。等待测试...

*****

### Other

#### Markdown语法
Markdown 是一种轻量级标记语言，创始人为John Gruber和Aaron Swartz。它允许人们“使用易读易写的纯文本格式编写文档，然后转换成有效的XHTML(或者HTML)文档”。[1]这种语言吸收了很多在电子邮件中已有的纯文本标记的特性。

[Markdown 语法说明](http://wowubuntu.com/markdown/)

##### Makefile
同学给了一个Makefile文件，可以通过make命令直接发布blog，修改源码的时候看到Makefile最后有一个.PHONY不太明白于是又补了一下[相关知识](http://blog.csdn.net/xjtuse_mal/article/details/5404894)，对这个稍稍有了了解。

在一个老外的[blog](http://kvz.io/blog/2012/09/25/blog-with-octopress/)上找到了这段Makefile的出处

*****

### 总结

回顾一下整个安装部署流程，对于ruby一窍不同的我显得十分费力，折腾了两天体会到同学之前说的 ，如果相关知识都了解的话，半个小时一个小时就可以搞定的。全部流程走一遍，对一些名词总算有些概念了。

实在记不下这么多，还是用写的踏实点，之前一年养成用evernote的习惯，希望之后能够慢慢加强一下，记笔记的同时顺便将重要的东西发布在blog上。本篇还是边抄别人边自己总结，一字一字码出来的，虽说自己内容不多，只是把别人的东西重新组织整理了一下。

*****

### 参考
#### [Deploying to Github Pages](http://octopress.org/docs/deploying/github/)
#### [Configuring Octopress](http://octopress.org/docs/configuring/)
#### [Deploying to Github Pages](http://octopress.org/docs/deploying/github/)
#### [3rd-party-plugins](https://github.com/imathis/octopress/wiki/3rd-party-plugins)

