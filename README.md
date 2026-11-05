# 此刻的三张牌

一个免费、无账户、无支付的本地塔罗体验。适合在电脑或手机浏览器测试流程与中文解读。

## 启动

在本目录打开终端，运行 `node server.mjs`，然后访问屏幕显示的本地地址。需要 Node.js 20 或更新版本。当前服务仅监听本机地址；手机测试需要另行配置局域网服务。

运行测试：`node --test core.test.mjs`。

## 分享给朋友测试

这个目录是静态网站，可以部署到 GitHub Pages。发布时把 `index.html`、`style.css`、`app.mjs`、`core.mjs`、`deck.mjs`、`THIRD_PARTY_LICENSE.txt` 和 `.nojekyll` 放在仓库根目录；在仓库 Settings → Pages 中选择从主分支根目录发布。发布后以 Pages 页面给出的实际网址为准，先用手机打开并走完一次抽牌，再分享给朋友。

公开网址意味着任何人都能看到网站和前端代码；请不要在这里放密码、私人资料或未授权的牌图。GitHub Pages 的具体设置与可用性以 GitHub 当前界面为准。

## 数据和隐私

不连接在线 API，不登录，不收款。问题和抽牌结果保存在当前浏览器的 localStorage；点击页面底部“清除本机记录”删除。复制摘要时不会包含原问题。不要输入真实姓名、电话或其他私人信息。

## 开源来源

78 张牌的英文名称、大小阿卡那分类和花色基本数据来自 [metabismuth/tarot-json](https://github.com/metabismuth/tarot-json)，MIT 许可证见本目录 `THIRD_PARTY_LICENSE.txt`。中文版名称、抽牌代码、解读文本和页面样式为本项目制作。没有使用该仓库中的扫描牌图。

仅免费使用也应保留第三方版权与许可证声明。此版本仅用于娱乐和自我反思，不作为专业建议。
