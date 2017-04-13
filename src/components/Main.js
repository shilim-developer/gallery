require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'

// 获取图片数组
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片名信息变成图片URL地址信息
imageDatas = (function getImageUrl(imageDatasArr) {
  for (let i=0;i<imageDatasArr.length;i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageUrl = require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

class ImgFigure extends React.Component {
  /*
  * 图片点击处理函数
   */
  handleClick = (e) => {
    if(this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {

    let styleObj = {};

    // 如果props属性中制定了这张图片的位置，则使用
    if(this.props.arrange.pos) {
        styleObj = this.props.arrange.pos;
    }

    // 如果图片的旋转角度有值并且不为0，添加旋转角度
    if(this.props.arrange.rotate) {
      ['Moz', 'Ms', 'Webkit', ''].forEach((value) => {
        styleObj[value+'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      });
    }

    // 设置居中图片的zindex值
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = "img-figure";
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.title}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class ControllerUnit extends React.Component {

  handleClick = (e) => {
    //如果点击的是正在选中态的按钮，则翻转图片，否则将图片居中
    if(this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    let controllerUnitClassName = "controller-unit";

    // 如果对应的是居中的图片，显示控制按钮的居中态
    if(this.props.arrange.isCenter) {
      controllerUnitClassName += " is-center";
      //如果对应的是翻转图片，显示控制按钮的翻转态
      if(this.props.arrange.isInverse) {
        controllerUnitClassName += " is-inverse";
      }
    }
    return (<span className={controllerUnitClassName} onClick={this.handleClick}></span>)
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: { // 中心取值范围
        left: 0,
        right: 0
      },
      hPosRange: { // 水平方向取值范围
        leftSecX:[0,0],
        rightSexX:[0,0],
        y:[0,0]
      },
      vPosRange: { // 垂直方向的取值范围
        x:[0,0],
        topY:[0,0]
      }
    }

    this.state = {
      imgsArrangeArr:[]
    }
  };

  // 获取区间内的一个随机值
  getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
  }

  // 获取0-30°之间的一个任意正负值
  get30DegRandom() {
    return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
  }

  /**
   * 翻转图片
   * @param index 输入当前被执行inverse操作的图片信息数组的index值
   * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
   */
  inverse(index) {
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }
  }

  // 重新布局所有图片
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecx = hPosRange.leftSecX,
        hPosRangeRightSecx = hPosRange.rightSexX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
        topImgSplicIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

    // 首先居中，centerIndex的图片, 居中的图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    }

    // 取出要布局上侧的图片的状态信息
    topImgSplicIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSplicIndex, topImgNum);

    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach((value,index) => {
      imgsArrangeTopArr[index] = {
        pos:{
          top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      }
    });


    // 布局左右两侧的图片
    for(let i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++) {
      let hPosRangeLORX = null;

      // 前半部分布局左边，右半部分布局右边
      if(i < k) {
        hPosRangeLORX = hPosRangeLeftSecx;
      } else {
        hPosRangeLORX = hPosRangeRightSecx;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: this.getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
          left: this.getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      }
    }

    if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSplicIndex,0,imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr:imgsArrangeArr
    });

  }

  /**
   * 利用rearrange函数，居中对应的index图片
   * @param index 将要被居中的图片的index值
   * @return {function()}
   */
  center(index){
    return () => {
      this.rearrange(index);
    };
  }

  //组件加载后，为每张图片计算其位置范围
  componentDidMount() {
    // 首先拿到舞台的大小
    let stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imageFigure的大小
    let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算左侧右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSexX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSexX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  render() {
    let controllerUnits = [],
      imgFigures = [];
    imageDatas.forEach((value,index) => {

      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter:false
        }
      }

      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index}
                                 arrange={this.state.imgsArrangeArr[index]}
                                 inverse={this.inverse(index)}
                                 center={this.center(index)}></ImgFigure>);
      controllerUnits.push(<ControllerUnit key={index}
                                           arrange={this.state.imgsArrangeArr[index]}
                                           inverse={this.inverse(index)}
                                           center={this.center(index)}></ControllerUnit>)
    });
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
