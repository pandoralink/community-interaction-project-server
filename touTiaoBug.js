// 手动爬虫
// 今日头条文章分析
let article_content = document.querySelector("#root > div.article-detail-container > div.main > div.article-content");
let article_meta = document.querySelector("#root > div.article-detail-container > div.main > div.article-content > div");
let article_onwer_name =  article_meta.querySelector(".name > a").innerHTML;
let article_name = article_content.querySelector("h1").innerHTML;
article_content.removeChild(article_meta);
let result = {
  content: article_content.innerHTML,
  onwer_name: article_onwer_name,
  name: article_name
}
console.log(JSON.stringify(result) + ",");