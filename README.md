# cheela-site

Personal site. Vite + React, deployed to GitHub Pages.

个人网站。技术栈是 Vite + React，部署在 GitHub Pages 上。

---

## Run it locally 本地运行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物在 dist/
npm run preview  # 本地预览构建结果
```

---

## What is where 文件在哪

```
src/data/site.js       所有简历内容。改这个文件就行，不用动组件
src/data/photos.js     摄影书的章节和每张照片的说明
src/styles/base.css    颜色、字体、纸张纹理这些全局 token
src/styles/home.css    首页
src/styles/book.css    摄影目录页和章节页
public/media/          视频和照片文件放这里
scripts/               生成占位素材的脚本，换成真素材后可以删掉
```

Content and presentation are kept apart on purpose: the two files under
`src/data/` hold every word and every file path, so day to day edits never
touch a component.

内容和样式是分开的：`src/data/` 下面那两个文件装了所有文字和图片路径，平时改
东西不需要碰组件。

---

## Replace the landing video 换开屏视频

The site ships with a placeholder that says **YOUR CLIP GOES HERE**. Replace
these two files and it is gone:

站里现在放的是占位视频，上面写着 YOUR CLIP GOES HERE。换掉这两个文件就好：

```
public/media/portrait.mp4          你的视频
public/media/portrait-poster.jpg   第一帧静图，视频加载前先显示
```

**Specs 规格**

| | |
|---|---|
| Aspect ratio | 3:4 竖构图，比如 720 x 960 |
| Length | 6 到 10 秒，首尾能接上最好 |
| Audio | 不需要，会被静音（浏览器要求 muted 才能自动播放）|
| Size | 尽量控制在 3 MB 以内，不然手机端加载慢 |

Grayscale, contrast and film grain are all applied in CSS, and the clip is
multiplied onto the page so its highlights pick up the grey of the background
instead of sitting on it as a white rectangle. Colour footage works fine.

黑白、对比度、颗粒感都是 CSS 加的，视频还用了 `mix-blend-mode: multiply`
混进背景，所以亮部会带上页面的灰调，不会变成一块突兀的白。你直接丢彩色原片
进去也没问题。

Turning a phone clip into the right shape with ffmpeg:

用 ffmpeg 把手机拍的原片转成合适的格式：

```bash
ffmpeg -i input.mov \
  -vf "scale=-2:960,crop=720:960,fps=24,format=gray" \
  -t 8 -an \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 \
  -movflags +faststart \
  public/media/portrait.mp4

# 再抽第一帧当封面
ffmpeg -i public/media/portrait.mp4 -vframes 1 -q:v 3 \
  public/media/portrait-poster.jpg
```

`format=gray` 会把色度通道扔掉，文件小很多，而且和 CSS 的效果一致。

Size of the clip on screen is one line, `src/styles/home.css`:

视频在页面上的大小就一行，在 `src/styles/home.css` 里：

```css
.landing__figure { width: min(13rem, 62%); }   /* 手机端 */
.landing { grid-template-columns: minmax(0, 1fr) 14.5rem; }  /* 电脑端 */
```

---

## Add photographs 加照片

1. Put the files in `public/media/photos/<chapter>/`
2. Add a line to that chapter's `plates` array in `src/data/photos.js`

```js
{ src: 'media/photos/montreal/07.jpg', w: 1400, h: 933, caption: 'Rue Rachel, late' }
```

- `src` 是相对 `public/` 的路径，前面不要加斜杠
- `w` / `h` 填图片真实像素尺寸。可以省略，但填了页面在加载时不会跳
- `caption` 一句话就够，书里那种图注的长度

To add a whole chapter, append an object to `albums`. The table of contents,
the roman numerals and the previous/next links all read from that array, so
nothing else needs changing.

要加一整章，就在 `albums` 数组里加一个对象。目录、罗马数字编号、上一章下一章
的链接全都是从这个数组算出来的，别的地方不用改。

**Preparing files 图片处理建议**

- 长边 1600 到 2000 px，JPEG 质量 80 左右
- 站里会用 CSS 统一转成黑白（`filter: grayscale(1)`），彩色原图也能放
- 章节标题很长的话，`src/styles/book.css` 里 `.contents__title` 和
  `.album__title` 的 `clamp()` 中间那个值要调小，不然窄屏会溢出

Delete `scripts/make_placeholders.py` and the placeholder files once your own
pictures are in. Nothing depends on them.

真照片放进去以后，`scripts/make_placeholders.py` 和占位图都可以删掉，站本身
不依赖它们。

---

## Deploy to GitHub Pages 部署

`.github/workflows/deploy.yml` is already set up. It builds on every push to
`main` and publishes `dist/`.

workflow 已经配好了，每次 push 到 `main` 就自动构建并发布 `dist/`。

**User site 用户站（`cheela.github.io`）**

1. 建一个仓库，名字必须正好是 `<你的用户名>.github.io`
2. push 上去
3. 仓库 Settings → Pages → Source 选 **GitHub Actions**
4. `VITE_BASE` 保持默认的 `/`，不用管

**Project site 项目站（`cheela.github.io/site/`）**

Same, plus: Settings → Secrets and variables → Actions → Variables → New
repository variable, named `VITE_BASE`, value `/site/` (斜杠开头也要斜杠结尾).

一样的流程，多一步：在 Settings → Secrets and variables → Actions →
Variables 里加一个仓库变量 `VITE_BASE`，值填 `/site/`。

**Why there is a `404.html` 为什么会有 404.html**

GitHub Pages has no server-side rewrite, so a deep link like `/photos/montreal`
would 404 before React ever runs. The build copies `index.html` to `404.html`,
which Pages serves for unknown paths, and the app then reads the URL and renders
the right page.

GitHub Pages 没有服务端 rewrite，直接访问 `/photos/montreal` 这种深链接会
404，React 根本没机会跑起来。构建时会把 `index.html` 复制一份叫 `404.html`，
Pages 遇到不认识的路径就返回它，然后前端读 URL 再渲染对应页面。这个逻辑在
`vite.config.js` 的 `spaFallback` 插件里。

---

## Before you go live 上线前检查

- [ ] `src/data/site.js` 里三个标了 `TODO` 的链接：GitHub 用户名、Devpost、
      项目仓库地址
- [x] 开屏视频已经换成你拍的那段：裁成 3:4（360x480，去掉了原片左右的黑边），
      24fps，196 KB。封面 `portrait-poster.jpg` 取的是对焦实了那一帧
- [ ] 视频下面那行图注现在写的是 "Montreal, 2026"，在 `site.js` 的
      `portrait.caption` 里改，不想要就设成空字符串
- [ ] 换掉占位照片，改掉 `photos.js` 里的 caption
- [ ] 简历上的电话号码**没有**放进站里。个人站是公开页面，电话建议不要挂上去，
      需要的话在 `site.js` 的 `links` 里自己加
- [ ] 学历那行现在写的是 "minor in Linguistics"，按你简历来的。要加认知科学
      就改 `education.degree`

---

## Design notes 设计说明

- Palette is four greys plus a cool near-white, all in `:root` in
  `base.css`. 换配色只改那几个变量就够，全站会跟着变
- Two typefaces: **EB Garamond** for anything book-like (name, chapter titles,
  contents, captions, small caps labels), **Inter** for reading text. 从
  Google Fonts 加载，在 `index.html` 里
- The paper texture is an inline SVG `feTurbulence` noise, reused for the film
  grain on the video. 一个 data URI，没有额外的图片请求
- 目录页的虚线是 `radial-gradient` 平铺出来的，不是 `border-dotted`，点的
  间距可以调（`base.css` 里的 `.leader`）
- 章节页支持键盘翻页：`j` / `k` 或左右方向键。上下键留给正常滚动
- `prefers-reduced-motion` 打开时，颗粒动画会停，视频不自动播放
