---
layout: post
title: "为Octopress添加Tag Clouds"
date: 2013-01-21 12:12
comments: true
categories: Octopress
tags: Octopress TagCloud
---

给blog添加了标签云的功能，不支持中文。

记录一下折腾流程。

<!--more-->

主要流程参照[这篇](http://agiledon.github.com/blog/2013/01/08/create-tag-for-octopress/)

### Tag Cloud插件

通过修改第三方插件[octopress-cumulus](https://github.com/bizkit/octopress-cumulus)来实现Tag Cloud的功能。

按原文的说法这个插件实质是category cloud的插件，因为category 和tag表示不同的维度，要用tag cloud就在这个基础上进行修改。

下载源码后将插件用到的文件复制到octopress的相应目录tagcloud.swf和category_generator.rb（octopress自带的插件，源码中没有找到）用于生成3D效果Flash，category_cloud.html边栏模板。

### 生成Tag目录

插件plugins/tag_generator.rb 是根据系统自带的category_generator.rb 修改的，主要功能用于读取post的markdown文件里的tags标签值，并生成相应目录，代码如下:
``` ruby tag_generator.rb
module Jekyll

  # The TagIndex class creates a single tag page for the specified tag.
  class TagIndex < Page

    # Initializes a new TagIndex.
    #
    #  +base+         is the String path to the <source>.
    #  +tag_dir+ is the String path between <source> and the tag folder.
    #  +tag+     is the tag currently being processed.
    def initialize(site, base, tag_dir, tag)
      @site = site
      @base = base
      @dir  = tag_dir
      @name = 'index.html'
      self.process(@name)
      # Read the YAML data from the layout page.
      self.read_yaml(File.join(base, '_layouts'), 'tag_index.html')
      self.data['tag']    = tag
      # Set the title for this page.
      title_prefix             = site.config['tag_title_prefix'] || 'Tag: '
      self.data['title']       = "#{title_prefix}#{tag}"
      # Set the meta-description for this page.
      meta_description_prefix  = site.config['tag_meta_description_prefix'] || 'Tag: '
      self.data['description'] = "#{meta_description_prefix}#{tag}"
    end

  end

  # The tagFeed class creates an Atom feed for the specified tag.
  class TagFeed < Page

    # Initializes a new tagFeed.
    #
    #  +base+         is the String path to the <source>.
    #  +tag_dir+ is the String path between <source> and the tag folder.
    #  +tag+     is the tag currently being processed.
    def initialize(site, base, tag_dir, tag)
      @site = site
      @base = base
      @dir  = tag_dir
      @name = 'atom.xml'
      self.process(@name)
      # Read the YAML data from the layout page.
      self.read_yaml(File.join(base, '_includes/custom'), 'tag_feed.xml')
      self.data['tag']    = tag
      # Set the title for this page.
      title_prefix             = site.config['tag_title_prefix'] || 'Tag: '
      self.data['title']       = "#{title_prefix}#{tag}"
      # Set the meta-description for this page.
      meta_description_prefix  = site.config['tag_meta_description_prefix'] || 'Tag: '
      self.data['description'] = "#{meta_description_prefix}#{tag}"

      # Set the correct feed URL.
      self.data['feed_url'] = "#{tag_dir}/#{name}"
    end

  end

  # The Site class is a built-in Jekyll class with access to global site config information.
  class Site

    # Creates an instance of tagIndex for each tag page, renders it, and
    # writes the output to a file.
    #
    #  +tag_dir+ is the String path to the tag folder.
    #  +tag+     is the tag currently being processed.
    def write_tag_index(tag_dir, tag)
      index = TagIndex.new(self, self.source, tag_dir, tag)
      index.render(self.layouts, site_payload)
      index.write(self.dest)
      # Record the fact that this page has been added, otherwise Site::cleanup will remove it.
      self.pages << index

      # Create an Atom-feed for each index.
      feed = TagFeed.new(self, self.source, tag_dir, tag)
      feed.render(self.layouts, site_payload)
      feed.write(self.dest)
      # Record the fact that this page has been added, otherwise Site::cleanup will remove it.
      self.pages << feed
    end

    # Loops through the list of tag pages and processes each one.
    def write_tag_indexes
      if self.layouts.key? 'tag_index'
        dir = self.config['tag_dir'] || 'tags'
        self.tags.keys.each do |tag|
          self.write_tag_index(File.join(dir, tag.gsub(/_|\P{Word}/, '-').gsub(/-{2,}/, '-').downcase), tag)
        end

      # Throw an exception if the layout couldn't be found.
      else
        throw "No 'tag_index' layout found."
      end
    end

  end


  # Jekyll hook - the generate method is called by jekyll, and generates all of the tag pages.
  class GenerateTags < Generator
    safe true
    priority :low

    def generate(site)
      site.write_tag_indexes
    end

  end


  # Adds some extra filters used during the tag creation process.
  module Filters

    # Outputs a list of tags as comma-separated <a> links. This is used
    # to output the tag list for each post on a tag page.
    #
    #  +tags+ is the list of tags to format.
    #
    # Returns string
    #
    def tag_links(tags)
      dir = @context.registers[:site].config['tag_dir']
      tags = tags.sort!.map do |item|
        "<a class='category' href='/#{dir}/#{item.gsub(/_|\P{Word}/, '-').gsub(/-{2,}/, '-').downcase}/'>#{item}</a>"
      end

      case tags.length
      when 0
        ""
      when 1
        tags[0].to_s
      else
        "#{tags[0...-1].join(', ')}, #{tags[-1]}"
      end
    end

    # Outputs the post.date as formatted html, with hooks for CSS styling.
    #
    #  +date+ is the date object to format as HTML.
    #
    # Returns string
    def date_to_html_string(date)
      result = '<span class="month">' + date.strftime('%b').upcase + '</span> '
      result += date.strftime('<span class="day">%d</span> ')
      result += date.strftime('<span class="year">%Y</span> ')
      result
    end

  end

end
```

### 生成Tag Cloud
保留原来的plugin/category_cloud.rb，重新添加tag_cloud.rb，将category_cloud.rb源码进行如下修改，并保存至tag_cloud.rb，通读了一下代码大致就是根据已经生成的tag列表以生成flash object标签并通过flashvars传入flash中要使用的参数。

``` ruby tag_cloud.rb
module Jekyll

  class TagCloud < Liquid::Tag

    def initialize(tag_name, markup, tokens)
      @opts = {}
      @opts['bgcolor'] = '#ffffff'
      @opts['tcolor1'] = '#333333'
      @opts['tcolor2'] = '#333333'
      @opts['hicolor'] = '#000000'

      opt_names = ['bgcolor', 'tcolor1', 'tcolor2', 'hicolor']

      opt_names.each do |opt_name|
          if markup.strip =~ /\s*#{opt_name}:(#[0-9a-fA-F]+)/iu
            @opts[opt_name] = $1
            markup = markup.strip.sub(/#{opt_name}:\w+/iu,'')
          end
      end

      opt_names = opt_names[1..3]
      opt_names.each do |opt_name|
          @opts[opt_name] = '0x' + @opts[opt_name][1..8]
      end

      super
    end

    def render(context)
      lists = {}
      max, min = 1, 1
      config = context.registers[:site].config
      tag_dir = config['url'] + config['root'] + config['tag_dir'] + '/'
      tags = context.registers[:site].tags
      tags.keys.sort_by{ |str| str.downcase }.each do |tag|
        count = tags[tag].count
        lists[tag] = count
        max = count if count > max
      end

      bgcolor = @opts['bgcolor']

      bgcolor = @opts['bgcolor']
      tcolor1 = @opts['tcolor1']
      tcolor2 = @opts['tcolor2']
      hicolor = @opts['hicolor']

      html = ''
      html << "<embed type='application/x-shockwave-flash' src='/javascripts/tagcloud.swf'"
      html << "width='100%' height='250' bgcolor='#{bgcolor}' id='tagcloudflash' name='tagcloudflash' quality='high' allowscriptaccess='always'"

      html << 'flashvars="'
      html << "tcolor=#{tcolor1}&amp;tcolor2=#{tcolor2}&amp;hicolor=#{hicolor}&amp;tspeed=100&amp;distr=true&amp;mode=tags&amp;"

      html << 'tagcloud='

      tagcloud = ''
      tagcloud << '<tags>'


      lists.each do | tag, counter |
        url = tag_dir + tag.gsub(/_|\P{Word}/u, '-').gsub(/-{2,}/u, '-').downcase
        style = "font-size: #{10 + (40 * Float(counter)/max)}%"

        tagcloud << "<a href='#{url}' style='#{style}'>#{tag}"
        tagcloud << "</a> "

      end

      tagcloud << '</tags>'

      # tagcloud urlencode
      tagcloud = CGI.escape(tagcloud)

      html << tagcloud
      html << '">'
      html
    end
  end
end

Liquid::Template.register_tag('tag_cloud', Jekyll::TagCloud)
```

### Tag页
在source/_layout目录下创建tag_index.html文件，可以参照category_index.html。将其中变量修改为tag相关
``` html tag_index.html
---
layout: page
footer: false
---

<div id="blog-archives" class="category">
{ % for post in site.tags[page.tag] % }
{ % capture this_year % }{{ post.date | date: "%Y" }}{ % endcapture % }
{ % unless year == this_year % }
    { % assign year = this_year % }
    <h2>{{ year }}</h2>
{ % endunless % }
<article>
    { % include archive_post.html % }
</article>
{ % endfor % }
</div>
```

### Post页
blog正文下部显示tag标签模板，具体代码模板如下
_layout/post.html在footer标签中添加如下代码，引用了post/tags.html，其实写一起也可以，但条例就显得不清了。
``` html post.html
<p class="meta">
    Tags: { % include post/tags.html % }
</p>
```

_includes/post目录下的tags.html代码如下：
``` html tag.html
{ % capture tag % }
{ % if post % }
{ { post.tags | tag_links | size } }
{ % else % }
{ { page.tags | tag_links | size } }
{ % endif % }
{ % endcapture % }
{ % unless tag == '0' % }
<span class="categories">
    { % if post % }
        { { post.tags | tag_links } }
    { % else % }
        { { page.tags | tag_links } }
    { % endif % }
</span>
{ % endunless % }
```

### 配置
修改配置文件_config.yml，添加tag_dir选项
``` ruby _config.yml
tag_dir: blog/tags
```

### 边栏模板
修改custom/asides目录下的模板文件tag_cloud.html
这个在原文里发觉作者漏了，但是下面的评论有人给补充了，贴上代码
``` yaml tag_cloud.html
<section>
    <h1>Tag Cloud</h1>
    <span id="tag-cloud">{ % category_cloud bgcolor:#f2f2f2 % }</span>
</section>
```

这样tag cloud就完成了。

* 使用代码高亮时不知为何rb语言标识符无法解析以致于{ 和 %之间多加了个空格，暂时还没有找到原因
