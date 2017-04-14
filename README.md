# gallery
a gallery demo by react

#### 参考课程 <br>
http://www.imooc.com/learn/507

#### 预览地址 <br>
https://shilim-developer.github.io/gallery/

#### 把项目发布到gh-pages上 <br>
```
$ git add dist
$ git commit -m "change dist"
$ git subtree push --prefix=dist origin gh-pages
```

#### 路径找不到问题 <br>
1.修改defaults.js中的```publicPath: '/assets/'```为```publicPath: 'assets/'```
2.修改index.html中的app的路径,修改```/assets/app.js```为```assets/app.js```

#### 收获 <br>
在macOS的浏览器上使用灰阶渲染字体，修复字体过粗问题：
* 灰阶渲染是通过控制字体轮廓上像素点的亮度，达到字体原始形状的方法
* 亚像素渲染则利用了LCD屏幕中每个像素是由RGB三个亚像素的颜色和亮度混合而成一个完整像素的颜色这一原理，将字体上的轮廓点由三个亚像素体现达到原始形状的方法，与灰阶渲染相比，分辨率在垂直方向上放大了三倍，因此，渲染效果更好。但是，所消耗的内存也更多。
因此在手机屏幕上，为了减少CPU的开销，使用灰阶渲染。但是在macOS操作系统上，采用的是亚像素渲染这种方式。

这会导致白色、亮色的字体，在深色背景下会显得过粗，严重情况下看上去会模糊。 但是我们可以通过修改浏览器上的属性，告诉浏览器怎么来渲染字体。

```
-webkit-font-smoothing: antialiased; //开启chrome在macOS上的灰阶平滑
-moz-osx-font-smoothing: grayscale; //开启firefox在macOS上的灰阶平滑
```
