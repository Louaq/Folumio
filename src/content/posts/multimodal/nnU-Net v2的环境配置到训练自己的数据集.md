---
title: nnU-Net v2的环境配置到训练自己的数据集
published: 2025-08-18 20:13:00
expires: 2025-08-21 23:59:59  
mathjax: true
excerpt: "nnU-Net v2的环境配置到训练自己的数据集"
category: nnUNet
tags: [nnUNet]
---

一、说明
nnU-Net v2的环境配置到训练自己的数据集

二、所需的环境配置
---------

官方文档地址：[GitHub-nnUNet](https://github.com/MIC-DKFZ/nnUNet/blob/master/readme.md)  
1. 版本要求：python >(或=) 3.9，pytorch>1.12.0 （之前使用的环境python版本为3.8.10，在安装nnU-Net时报错。torch最好的GPU版本的）  
2. 创建虚拟环境：在pycharm中打开终端，输入命令行：`conda create -n nnUNet python=3.9`，创建一个名字为nnUNet的虚拟环境，并且指定python为3.9的版本  
![创建虚拟环境](https://pic1.imgdb.cn/i/0343OVbv5jao0z28whOtmO.webp)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/de8d37169baea59b927d6ca1da9b1a63.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/0368fa13db18c6c5393c92574ccfa669.png)  
3. 在虚拟环境中安装torch：  
（1） 首先输入：`nvidia-smi` 查看信息，下图中的CUDA Version:12.0是指CUDA最高版本为12.0，即安装GPU版本的torch 的时候，安装12.0以下的版本  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/dc6babba2d6e7d897fa6c0ee605bd08b.png)

（2） 打开Pytorch官网：[Pytorch地址](https://pytorch.org/)，在此界面下拉，按照自己配置选择，然后复制给出的命令行  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/b601eca2dae7bc675be22ddfab7909a2.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/cc48616ee57f0fa7615389db089affd4.png)  
（3) 回到pycharm终端，进入粘贴此代码，进行torch安装

![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/e5173ff81c6c1f7fbe7b270afc474c26.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/06185ac43474e03d5694503868785362.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/01b0b58b242f0dfb0e7b6a9ba46fecb4.png)

三、nnUNet框架的安装
-------------

**注意：**环境已经安装配好之后，接下来的所有操作都在此环境中，即：都需要先激活虚拟环境。[GitHub-文档说明link](https://github.com/MIC-DKFZ/nnUNet/blob/master/documentation/installation_instructions.md)  
1. 安装nnUNet：（1）激活虚拟环境，（2）使用此命令行：

```bash
pip install nnunetv2
```

2. 创建nnUNet代码副本，和直接在GitHub上下载下来一样效果，继续在终端的虚拟环境中，按顺序分别执行以下3个命令行：（**注意：**最后一个命令最后有一个`.`）其中，`pip install -e .`的目的：（1）安装nnUNet需要的python包；（2）向终端添加新的命令，这些命令用于后续整个nnU-Net pipeline的执行，这些命令都有一个前缀：`nnUNetv2_`

```bash
git clone https://github.com/MIC-DKFZ/nnUNet.git
cd nnUNet
pip install -e .
```

具体步骤如下图：  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/e137f3ae8891c34667937d4b1f2b793e.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/7ccfb68516b87a1ecb86f478521bd32a.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/43fdc9c278a761d3d405309f224f6f1a.png)

3. 安装隐藏层（可选，可以不安装），hiddenlayer 使 nnU-net 能够生成网络拓扑图

```bash
pip install --upgrade git+https://github.com/FabianIsensee/hiddenlayer.git
```

![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/b9596997c68a5d22506b060a43e23f8e.png)

四、数据集的准备
--------

得到克隆之后的副本，即：**`名为 nnUNet 的文件夹`**，参照官方文档，准备数据集。[GitHub-文档说明link](https://github.com/MIC-DKFZ/nnUNet/blob/master/documentation/dataset_format.md)  
1. 数据集文件夹结构：按照如下步骤创建文件夹，存放相应的数据集  
（1） 在 **`名为 nnUNet 的文件夹`** 中创建一个名为 **`名为 GATASET 的文件夹`** 的文件夹  
（2） 在 **`名为 GATASET 的文件夹`** 中创建3个文件夹，命名分别为：**`nnUNet_raw`**、**`nnUNet_preprocessed`** 和 **`nnUNet_trained_models`**。如下图所示：

![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/c4ae1e1f81bd93f52574415e13e6ae78.png)  
（3) 在 **`名为 nnUNet_raw 的文件夹`** 中创建1个 **`名为 Dataset001_Teeth 的文件夹`**

> 说明1：文件夹命名为：Dataset+三位整数+任务名，`Dataset001_Teeth`中数据集ID为1，任务名为Teeth。此文件夹下存放需要的训练数据集`imageTr`、测试集`imageTs`、标签`labelsTr`。其中`imageTs` 是与`imageTr`中一一对应的标签，文件中都是nii.gz文件。`imageTs`是可选项，可以没有。如下图所示

![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/8ae544c2cb75b57e6d29bca386680160.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/a73e5e753f6a49692d0bf2d4e01db7cb.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/0c49bc0086fb6a49408bdb149fc5a080.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/116fd22a16f68c81bc333eafd3131807.png)

> 说明2：json文件是对三个文件夹内容的字典呈现。先在 `Dataset001_Teeth`文件夹下创建一个空白的dataset.json文件，然后运行以下代码写入相应的 json文件

```json
import json

nnUNet_dir = '/root/autodl-tmp/nnU-Net/nnUNet/DATASET/' #此路径根据自己实际修改

def sts_json():
    info = {
        "channel_names": {
            "0": "CBCT"
        },
        "labels": {
            "background": 0,
            "Teeth": 1
        },
        "numTraining": 12,
        "file_ending": ".nii.gz"
    }
    with open(nnUNet_dir + 'nnUNet_raw/Dataset001_Teeth/dataset.json',
              'w') as f:
        json.dump(info, f, indent=4)

sts_json()
```

> 运行后生成的 json文件内容如下：

![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/c5ec2824f26c5035f3ef5d6886da09cb.png)

五、设置读取文件路径设置（重要）
----------------

1. 需要让nnUNet知道文件存放在哪里，否则执行数据处理等一下相关操作都会报错，如下图  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/82cfd1ddfcac5fedc51a36bf2f288695.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/5bcd4862b16d7dafcc340779df9ee939.png)

2. **方法一：**(自己使用的方法一)  
（1） 找到`root`文件夹下的`.bashrc`文件（**注：**这里自己租用的云平台的服务器，若是自己的服务器在home文件夹下找 .bashrc文件，若没有，在home目录下使用Ctrl+h，显示隐藏文件）  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/5ff79d28073be772873a0a71b45682c6.png)  
（2) 打开`.bashrc`文件，在最后添加此三行内容，记得要更新一下修改后的文件，具体说明如下图

```bash
export nnUNet_raw="/root/autodl-tmp/nnU-Net/nnUNet/DATASET/nnUNet_raw"
export nnUNet_preprocessed="/root/autodl-tmp/nnU-Net/nnUNet/DATASET/nnUNet_preprocessed"
export nnUNet_results="/root/autodl-tmp/nnU-Net/nnUNet/DATASET/nnUNet_trained_models"

```

![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/6b04d3eb183444caf2f085a12149bd68.png)

3. **方法二：**

![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/ebe2de684b113d2ab1777598b69f538a.png)  
4 注：更新文档可以点击按钮更新，然后在终端使用命令行`source .bashrc`更新，如下图  
（1）![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/fa472dc72c8900a87589bf945436ef99.png)  
（2）  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/62de176ab1255809dc9dbc0f8a0bb8ef.png)

六、数据集的转换
--------

1.  此任务的数据集不需要格式转换，此步骤是为了将数据集转换成上述imageTr文件夹里面图片中显示的样子：`名字_000X` 的形式
2.  数据集转换的指令：

```bash
nnUNet_convert_decathlon_task -i /root/autodl-tmp/nnU-Net/nnUNet/DATASET/nnUNet_raw/Dataset001_Teeth
```

3.  此步骤参考：[link](https://blog.csdn.net/m0_68239345/article/details/128886376)

七、数据集预处理
--------

1. 此步骤对数据进行：裁剪crop，重采样resample以及标准化normalization，具体论文中有讲解，或参看此博文：[nnU-Net论文解读](https://blog.csdn.net/u014264373/article/details/116792649)。将提取数据集指纹（一组特定于数据集的属性，例如图像大小、体素间距、强度信息等）。此信息用于设计三种 [U-Net](https://so.csdn.net/so/search?q=U-Net&spm=1001.2101.3001.7020) 配置。每个管道都在其自己的数据集预处理版本上运行  
2. 继续在虚拟环境中执行一下命令行：

```bash
nnUNetv2_plan_and_preprocess -d DATASET_ID --verify_dataset_integrity  
```

此命令行中的DATASRT\_ID根据自己任务修改，此任务中，`Dataset001_Teeth` 中可知ID为`1` 所以执行的命令为：

```bash
nnUNetv2_plan_and_preprocess -d 1 --verify_dataset_integrity  
```

具体如下图所示：  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/b1b1b7d1fe609cf5ed5bbb4378a837b7.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/d7136ee39fe458a76a66a70602e00450.png)

3. 运行后将在 nnUNet\_preprocessed 文件夹中创建一个以数据集命名的新子文件夹。命令完成后，将出现一个 dataset\_fingerprint.json 文件以及一个 nnUNetPlans.json 文件。还有一些子文件夹包含 UNet 配置的预处理数据。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/7b4fe6f4ae9367519bac57aa3544cc98.png)

八、模型训练
------

1. 这是五折交叉验证，可以使用代码直接一折一折接着跑  
（1.1） 创建一个`tst.sh` 文件，并写入此代码：

```python
for fold in {0..4}
do 
    # echo "nnUNetv2_train 1 3d_lowres $fold"
    nnUNetv2_train 1 3d_lowres $fold 
done
```

（1.2） 在虚拟环境下的终端运行此 `tst.sh` 文件，使用 `source`命令可以执行脚本（[参考link](https://blog.csdn.net/GX_1_11_real/article/details/80990250)），具体命令行为：

```bash
source /root/autodl-tmp/nnU-Net/sts.sh
```

具体为下图所示：

![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/d84191aa7954548aab6dfbe52e0b11a4.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/cef78c7b6f3b166747a45a99f4f271e7.png)

2. 也可以使用代码一折跑完，再次运行代码跑第二折：  
进入虚拟环境，使用命令行：

```bash
nnUNetv2_train 1 3d_lowres 0   # 其中1表示数据集ID，上述提及过。0表示第1折
```

设置的是1000 epoch，第一折的1000epoch跑结束之后，修改命令行中的折数，即最后一个数：

```bash
nnUNetv2_train 1 3d_lowres 1   # 其中1表示数据集ID，上述提及过。1表示第2折
```

直到跑完5折交叉验证。

3. 在正常运行代码后遇到的问题：  
（1） 不小心碰到键盘或者Ctrl+C会中断实验，此代码会50个epoch保存一下checkpoint ，若中断使用：原来指令后面加`--c`可以接着运行，用运行第一折时中断为例：

```bash
nnUNetv2 train 1 3d_lowres 0 --c
```

![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/7429e0deb61f97783f31c71bb702f8ec.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/221f20096c3ed7c326c2be9ec3b11c35.png)

（2）nohup 后台挂起，使用`nohup+运行的命令行+&`，这样断网什么的不会影响进程


:::important
转载自CSDN博客：https://blog.csdn.net/m0_45521766/article/details/131539779
:::
