 //神经网络
 let layer_defs = [];
 // 输入层：即是300*300*3的图像
 layer_defs.push({ type: 'input', out_sx: 300, out_sy: 300, out_depth: 3 });
 // 卷积层 
 // filter：用16个20*20的滤波器去卷积
 // stride：卷积步长为1
 // padding：填充宽度为2（为保证输出的图像大小不会发生变化）
 // activation：激活函数为relu（还有Tanh、Sigmoid等等函数，功能不同）
 layer_defs.push({ type: 'conv', sx: 20, filters: 16, stride: 1, pad: 2, activation: 'relu' });
 // 池化层
 // 池化滤波器的大小为20*20
 // stride：步长为2
 // 在这里我们无法看出这个框架池化是使用的Avy Pooling还是Max Pooling算法，先视为后者
 layer_defs.push({ type: 'pool', sx: 20, stride: 2 });
 // 反复卷积和池化减小模型误差
 layer_defs.push({ type: 'conv', sx: 20, filters: 16, stride: 1, pad: 2, activation: 'relu' });
 layer_defs.push({ type: 'pool', sx: 20, stride: 2 });
 layer_defs.push({ type: 'conv', sx: 20, filters: 16, stride: 1, pad: 2, activation: 'relu' });
 layer_defs.push({ type: 'pool', sx: 20, stride: 2 });
 // 分类器：输出10中不同的类别
 layer_defs.push({ type: 'softmax', num_classes: 10 });
 // 初始化神经网路
 const net = new convnetjs.Net();
 net.makeLayers(layer_defs);
 // 初始化训练机制
 const trainer = new convnetjs.SGDTrainer(net, { learning_rate: 0.01, momentum: 0.9, batch_size: 5, l2_decay: 0.0 });
 let imageList = [];
 const loadData = i => {
     return function () {
         return new Promise(function (resolve, reject) {
             let image = new Image();
             image.crossOrigin = "anonymous";
             image.src = numberList[i].url;
             image.onload = function () {
                 let vol = convnetjs.img_to_vol(image);
                 trainer.train(vol, i);
                 resolve();
             };
             image.onerror = reject;
         })
     }
 }
 for (let j = 0; j < numberList.length; j++) {
     imageList.push(loadData(j));
 }
 var testBtn = document.getElementById("test")
 function training(){
     testBtn.disabled = true
     return new Promise((resolve, reject) => {
         Promise.all(imageList.map(imageContainer => imageContainer())).then(() => {
             console.log("模型训练好了！！！👌")
             testBtn.disabled = false
             resolve()
         })
     })
 }
 training().then(() => {
     testBtn.addEventListener('click', () => {
         // 告诉机器每一类对应的是什么（即让机器认识图片的过程）
         const NumberNameList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
            const result = Array.from(net.forward(image).w);
            let max = Math.max.apply(Math, result);
            console.log("最有可能的那个数字是", NumberNameList[result.indexOf(max)])
            console.log("接着训练！！！💪")
         };
     })
 })