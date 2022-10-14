配置 `dotenv(读作：dote-in-v)`

# 连接池

1. 实际使用时发现错误，`Error: Cannot enqueue Query after fatal error.`
   1. 解决方案：网上参考是使用连接池（`pooling`），但我不是很懂为啥会和连接池有关
   2. 参考资料
      1. [nodejs 解决Error: Cannot enqueue Query after fatal error.](https://www.winnerpm.work/edit/nodejs-%E8%A7%A3%E5%86%B3error-cannot-enqueue-query-after-fatal-error/)