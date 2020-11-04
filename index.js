'use strict';

const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

let port = process.env.PORT || 3000;
server.listen(port);
console.log("Server started! It's listening on port %s", port);

function createSvgXml({
  width = 100,
  height = 100,
  bgColor = '#999',
  fColor = '#fff',
  text = undefined,
}) {
  return `
		<svg xmlns="http://www.w3.org/2000/svg" height="${height}" width="${width}">
			<rect width="${width}" height="${height}" style="fill:${bgColor}" />
			<text x="50%" y="50%" font-size="20" dy=".3em" fill="${fColor}" text-anchor="middle">${
    text || `${width}x${height}`
  }</text>
		</svg>
	`;
}

app.get('/', function (req, res) {
  const codeStr = (code) =>
    `<code style="background-color: rgba(27,31,35,.05);border-radius: 3px;padding: 3px 8px;">${code}</code>`;
  res.send(`<div>
		<h2>欢迎使用 charming-img-holder ！</h2>
		<h4>使用方法如下:</h4>
		<p>1. 传入宽高：${codeStr('http://img-holder.charming.run/200x100')}</p>
		${createSvgXml({ width: 200, height: 100 })}
		<p>(宽高一致，也可仅传${codeStr(
      '/100'
    )}, ${codeStr('http://img-holder.charming.run/100')})</p>
		${createSvgXml({ width: 100, height: 100 })}
		<p>2. 传入背景色、字体颜色${codeStr(
      '/[width]x[height]/:bgColor/:fontColor'
    )}，如：${codeStr('http://img-holder.charming.run/100/000/FF0000')}</p>
		${createSvgXml({ width: 100, height: 100, bgColor: '#000', fColor: '#FF0000' })}
		<p>3. 传入文字${codeStr(
      'http://img-holder.charming.run/200?text=这是一段文字'
    )}</p>
		${createSvgXml({ width: 200, height: 200, text: '这是一段文字' })}
	</div>`);
});
const commonRes = (req, res, next) => {
  try {
    const { widthHeight, bgColor, fColor } = req.params;
    const whArr = widthHeight.split('x');
    const width = whArr[0];
    const height = whArr[1] || width;
    const text = req.query.text;
    const gc = (c) => (c ? '#' + c : c);
    let svgXml = createSvgXml({
      width,
      height,
      bgColor: gc(bgColor),
      fColor: gc(fColor),
      text,
    });

    res.type('image/svg+xml');
    res.send(svgXml);
    res.end();
  } catch (error) {
    next();
  }
};
app.get('/:widthHeight', commonRes);
app.get('/:widthHeight/:bgColor', commonRes);
app.get('/:widthHeight/:bgColor/:fColor', commonRes);

app.use((req, res) => {
  res.send('参数错误，请检查参数后重试...');
});
