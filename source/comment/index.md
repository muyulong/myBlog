---
title: 留言板
date: 2018-12-20 23:13:48
description: 
comments: true
top_img: https://gitee.com/muyulong/blogpic/raw/master/image/202108201230828.jpg
---
{% raw %}
    <h3><p id="hitokoto_text">:D 获取中...</p></h3>
	<script>
	  fetch('https://v1.hitokoto.cn?c=a&c=b&c=c&c=h')
		.then(response => response.json())
		.then(data => {
		  const hitokoto = document.getElementById('hitokoto_text')
		  const from = document.getElementById('from')
		  hitokoto.innerText = data.hitokoto+"--《"+data.from+"》"
		})
		.catch(console.error)
	</script>
{% endraw %}