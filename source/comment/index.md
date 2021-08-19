---
title: 留言板
date: 2018-12-20 23:13:48
description: 
comments: true
top_img: https://cdn.jsdelivr.net/gh/honjun/cdn@1.4/img/banner/comment.jpg
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