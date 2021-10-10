// 手动爬虫
// 今日头条文章分析
let article_content = document.querySelector("#root > div.article-detail-container > div.main > div.article-content");
let article_cover = document.querySelector(".pgc-img img");
article_cover = article_cover ? article_cover.src : null;
let article_author_avatar_url = document.querySelector("#root > div.article-detail-container > div.right-sidebar > div:nth-child(1) > div > div.user-info > a.user-avatar > img").src;
let article_meta = document.querySelector("#root > div.article-detail-container > div.main > div.article-content > div");
let article_author_name =  article_meta.querySelector(".name > a").innerHTML;
let article_title = article_content.querySelector("h1").innerHTML;
article_content.removeChild(article_meta);
let result = {
  article_content: article_content.innerHTML,
  article_cover: article_cover,
  article_author_name: article_author_name,
  article_title: article_title,
  article_author_avatar_url: article_author_avatar_url,
}
return JSON.stringify(result);