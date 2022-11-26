<p align="center"><img alt="APP 图片" align="center" width="100px" height="100px" src="./doc/ic_book_128.svg"/></p><br />
<p align="center">
  <a href="https://baike.baidu.com/item/X%2FMIT%E8%AE%B8%E5%8F%AF%E5%8D%8F%E8%AE%AE/10136122?fr=aladdin">
    <img src="https://img.shields.io/github/license/pandoralink/CommunityInteractionProject-H5" alt="License">
  </a>
  <img src="https://img.shields.io/github/languages/top/pandoralink/community-interaction-project-server" alt="javascript-99.5%" />
  <img src="https://img.shields.io/github/languages/count/pandoralink/community-interaction-project-server" alt="languages-3">
</p>

此项目为互动社区 `APP` 的 `Server` 后台服务

# feature

1. 基于 `Github WebHooks` 实现自动化部署

# 相关项目

1. 原生 `Android` 开发 `APP`，技术栈为 `java`，[content-chat-app](https://github.com/pandoralink/content-chat-app)
2. 基于上面那个原生 `Android`，迁移至 `React-Native + expo`
   跨端技术栈，[CommunityInteractionProject-expo](https://github.com/pandoralink/CommunityInteractionProject-expo)
3. 互动社区 `APP` 的 `H5` 页面部分，[CommunityInteractionProject-H5](https://github.com/pandoralink/CommunityInteractionProject-H5)
4. 互动社区 `APP` 的 `Server` 后台服务，[community-interaction-project-server](https://github.com/pandoralink/community-interaction-project-server)

# 环境变量

配置 `dotenv(读作：dote-in-v)`

# 连接池

1. 实际使用时发现错误，`Error: Cannot enqueue Query after fatal error.`
   1. 解决方案：网上参考是使用连接池（`pooling`），但我不是很懂为啥会和连接池有关
   2. 参考资料
      1. [nodejs 解决Error: Cannot enqueue Query after fatal error.](https://www.winnerpm.work/edit/nodejs-%E8%A7%A3%E5%86%B3error-cannot-enqueue-query-after-fatal-error/)