//十六进制颜色值域RGB格式颜色值之间的相互转换
//-------------------------------------
//十六进制颜色值的正则表达式
let colorRegex = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
let toStringHexColor = function (stringRgb) {
  if (/^(rgb|RGB)/.test(stringRgb)) {
    let aColor = stringRgb.replace(/(?:||rgb|RGB)*/g, "").split(",");
    let strHex = "#";
    for (let i = 0; i < aColor.length; i++) {
      let hex = Number(aColor[i]).toString(16);
      if (hex === "0") {
        hex += hex;
      }
      strHex += hex;
    }
    if (strHex.length !== 7) {
      strHex = stringRgb;
    }
    return strHex;
  } else if (colorRegex.test(stringRgb)) {
    let aNum = stringRgb.replace(/#/, "").split("");
    if (aNum.length === 6) {
      return stringRgb;
    } else if (aNum.length === 3) {
      let numHex = "#";
      for (let i = 0; i < aNum.length; i += 1) {
        numHex += (aNum[i] + aNum[i]);
      }
      return numHex;
    }
  } else {
    return stringRgb;
  }
};

let toHexColor = function(stringRgb) {
  let aColor = stringRgb.split(",");
  let strHex = "#";
  for (let i = 0; i < aColor.length; i++) {
    let hex = Number(aColor[i]).toString(16);
    if (hex === "0") {
      hex += hex;
    }
    strHex += hex;
  }
  if (strHex.length !== 7) {
    strHex = stringRgb;
  }
  return strHex;
};

//-------------------------------------------------

/*16进制颜色转为RGB格式*/
let toRGBcolor = function (hexColor) {
  let sColor = hexColor.toLowerCase();
  if (sColor && colorRegex.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }
    return "RGB(" + sColorChange.join(",") + ")";
  } else {
    return sColor;
  }
};

/**
 * 判断是否是rgb颜色
 *
 * @param {any} color
 * @returns
 */
function isRgbColor(color){
  const regexHex = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  const colors = color.split(',');
  return !regexHex.test(color) && colors.length === 3;
}

module.exports = {
  toStringHexColor: toStringHexColor,
  toRGBcolor: toRGBcolor,
  toHexColor: toHexColor,
  isRgbColor: isRgbColor
}
