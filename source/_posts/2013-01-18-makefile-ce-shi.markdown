---
layout: post
title: "Makefile 测试"
date: 2013-01-18 16:56
comments: true
categories: 
tags: Octopress Plugin Makefile
---

Makefile脚本中应使用tab替代空格，参见[上篇](http://blog.songyee.com/blog/2013/01/17/octopressda-jian-github-pages/) Makefile部分

<!--more-->

``` bash
blog:
    git pull && \
    rake setup_github_pages\[git@github.com:s0ngyee/s0ngyee.github.git\] && \
    bundle install && \
    rake integrate && \
    rake generate && \
    rake deploy && \
    git add .; \
    git commit -am "${MSG}"; \
    git push origin master
.PHONY: blog%
```
