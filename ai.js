 const convnetjs = require('convnetjs2');
 const numberList = require('./face');
 const Jimp = require('jimp')


 function image2sample (image) { // convert image data into CNN input
    var p = image.data
    var x = new convnetjs.Vol(100, 100, 3, 0.0)
    for (var dc = 0; dc < 3; dc++) {
      var i = 0
      for (var xc = 0; xc < 100; xc++) {
        for (var yc = 0; yc < 100; yc++) {
          var ix = i * 4 + dc
          x.set(yc, xc, dc, p[ix] / 255.0 - 0.5)
          i++
        }
      }
    }
    return x
  }
 
//神经网络
let layer_defs = [];
// 输入层：即是100*100*3的图像
layer_defs.push({ type: 'input', out_sx: 100, out_sy: 100, out_depth: 3 });
// 卷积层 
// filter：用16个5*5的滤波器去卷积
// stride：卷积步长为1
// padding：填充宽度为2（为保证输出的图像大小不会发生变化）
// activation：激活函数为relu（还有Tanh、Sigmoid等等函数，功能不同）
layer_defs.push({ type: 'conv', sx: 5, filters: 16, stride: 1, pad: 3, activation: 'relu' });
// 池化层
// 池化滤波器的大小为2*2
// stride：步长为2
// 在这里我们无法看出这个框架池化是使用的Avy Pooling还是Max Pooling算法，先视为后者
layer_defs.push({ type: 'pool', sx: 2, stride: 2 });
// 反复卷积和池化减小模型误差
layer_defs.push({ type: 'conv', sx: 5, filters: 20, stride: 1, pad: 2, activation: 'relu' });
layer_defs.push({ type: 'pool', sx: 2, stride: 2 });
layer_defs.push({ type: 'conv', sx: 5, filters: 20, stride: 1, pad: 2, activation: 'relu' });
layer_defs.push({ type: 'pool', sx: 2, stride: 2 });
// 分类器：输出10中不同的类别
layer_defs.push({ type: 'softmax', num_classes: 10 });
// 初始化神经网路
const net = new convnetjs.Net();
net.makeLayers(layer_defs);
 // 初始化训练机制
 const trainer = new convnetjs.SGDTrainer(net, { learning_rate: 0.01, momentum: 0.9, batch_size: 5, l2_decay: 0.0 });
 
 const loadData = i => {
     return new Promise(async function (resove, reject) {
        var image = await Jimp.read(numberList[i].url)
        var image100 = image.resize(100, 100)
        var x = image2sample(image100.bitmap)
        trainer.train(x, numberList[i].index);
        resove(i)
     });
 }

 exports.training = function() {
     let imageList = [];
    for (let j = 0; j < numberList.length; j++) {
        imageList.push(loadData(j));
    }
    return Promise.all(imageList)
 }


 exports.checkNumber = async function (image) {
    const NumberNameList = ["狗", "猫"];
    var image = await Jimp.read(image)
    var image100 = image.resize(100, 100)
    var x = image2sample(image100.bitmap)
    const result = Array.from(net.forward(x).w);
    let max = Math.max.apply(Math, result);
    return NumberNameList[result.indexOf(max)];
 }