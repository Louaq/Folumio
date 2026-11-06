---
title: 深度学习环境配置2——windows下的torch=1.2.0环境配置
published: 2025-02-06 16:27:00
expires: 2025-03-01 23:59:59
mathjax: true
excerpt: "CUDA环境安装"
cover: "https://pic1.imgdb.cn/i/0343OWEIOFiGWX2DHExx8y.webp"
tags: [python, Deep Learning, CUDA, cudnn]
category: 深度学习
---

### 一、Anaconda安装

**Anaconda的安装主要是为了方便环境管理，可以同时在一个电脑上安装多种环境，不同环境放置不同框架：pytorch、tensorflow、keras可以在不同的环境下安装，只需要使用conda create –n创建新环境即可。**

#### 1、Anaconda的下载

同学们可以选择安装新版Anaconda和旧版的Anaconda，安装步骤没有什么区别。

**旧版本anaconda的下载：**  
**新版本的Anaconda没有VSCODE，如果大家为了安装VSCODE方便可以直接安装旧版的Anaconda，百度网盘连接如下。也可以装新版然后分开装VSCODE。**  
链接: [https://pan.baidu.com/s/12tW0Oad\_Tqn7jNs8RNkvFA](https://pan.baidu.com/s/12tW0Oad_Tqn7jNs8RNkvFA) 提取码: i83n

**新版本anaconda的下载：**  
如果想要安装最新的Anaconda，首先登录Anaconda的官网：[https://www.anaconda.com/distribution/](https://www.anaconda.com/distribution/)。直接下载对应安装包就可以。  
![在这里插入图片描述](https://pic1.imgdb.cn/i/0343OWEIOFiGWX2DHExx8y.webp)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/79729ea1f6363089a7b848e2bbb41119.png)  
一般是下载64位的，下载完成后打开。

#### 2、Anaconda的安装

![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/b04e1b9b3c820f4212c77e872f721ff0.png)  
选择安装的位置，可以不安装在C盘。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/cf41baaf1550d7d707c56da7997bf467.png)  
我选择了Add Anaconda to my PATH environment variable，这样会自动将anaconda装到系统的环境变量中，配置会更加方便一些。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/34a7c27d1eb9256186f88e6e610ffbd5.png)  
等待安装完之后，Anaconda的安装就结束了。

### 二、Cudnn和CUDA的下载和安装

**我这里使用的是torch=1.2.0，官方推荐的Cuda版本是10.0，因此会用到cuda10.0，与cuda10.0对应的cudnn是7.4.1。**

#### 1、Cudnn和CUDA的下载

**网盘下载：**  
链接: [https://pan.baidu.com/s/1znYSRDtLNFLufAuItOeoyQ](https://pan.baidu.com/s/1znYSRDtLNFLufAuItOeoyQ)  
提取码: 8ggr

**官网下载：**  
cuda10.0官网的地址是：  
[cuda10.0官网地址](https://developer.nvidia.com/cuda-10.0-download-archive?target_os=Windows&target_arch=x86_64&target_version=10&target_type=exelocal)  
cudnn官网的地址是：需要大家进去后寻找7.4.1.5。  
[cudnn官网地址](https://developer.nvidia.com/cudnn)

下载完之后得到这两个文件。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/829e732c6e6228e02d96c3b7bd115d9b.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/8d273ca827020e1e079a78743bd000c5.png)

#### 2、Cudnn和CUDA的安装

下载好之后可以打开exe文件进行安装。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/c1fa30103f2316fc350436a8815d54e0.png)  
这里选择自定义。  
![不](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/1bf16ce7629339969e0830a1630bd182.png)  
然后直接点下一步就行了。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/d833eb6e1fa90ca9f621eb1072fe25aa.png)  
安装完后在C盘这个位置可以找到根目录。  
C:\\Program Files\\NVIDIA GPU Computing Toolkit\\CUDA\\v10.0  
然后大家把Cudnn的内容进行解压。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/0ae6fdd762c2435ef118a642b341d4ba.png)  
把这里面的内容直接复制到C盘的根目录下就可以了。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/a88d013177374fcfecfec1e3865e3c5e.png)

### 三、配置torch环境

#### 1、pytorch环境的创建与激活

Win+R启动cmd，在命令提示符内输入以下命令：

```bash
conda create –n pytorch python=3.6
```
```bash
activate pytorch
```

这里一共存在两条指令：  
前面一条指令用于创建一个名为pytorch的环境，该环境的python版本为3.6。  
后面一条指令用于激活一个名为pytorch的环境。

#### 2、pytorch库的安装

由于我们所有的操作都要在对应环境中进行，所以在进行库的安装前需要先激活环境。

```bash
activate pytorch 
```

此时cmd窗口的样子为：  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/e67dbf5cfc4f4125fedbffcb3bd85b77.png)

##### a、官方推荐安装方法（推荐）

打开pytorch的官方安装方法：  
[https://pytorch.org/get-started/previous-versions/](https://pytorch.org/get-started/previous-versions/)  
官网推荐的安装代码如下，我使用的是Cuda10的版本，不太懂为什么要写3个=才能正确定位，两个=会定位到cuda92的whl：

```bash
# CUDA 10.0
pip install torch===1.2.0 torchvision===0.4.0 -f https://download.pytorch.org/whl/torch_stable.html
```

这是pytorch官方提供的指令，用于安装torch和torchvision。

##### b、先下载whl后安装

需要注意的是，直接这样安装似乎特别慢，因此我们可以进入如下网址:  
[https://download.pytorch.org/whl/torch\_stable.html](https://download.pytorch.org/whl/torch_stable.html)  
找到自己需要的轮子下载。下载的时候使用迅雷下载就行了，速度还是比较快的！  
<img src="https://i-blog.csdnimg.cn/blog_migrate/08b8a756b9d7d214ce81f10bb5b73758.png#pic_center" alt="在这里插入图片描述"  />  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/737ffc86979d1e7ceda0d98b5ddcef41.png)  
下载完成后找到安装路径：  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/1eae8e7fae0ea98cc5559e6287059451.png)  
在cmd定位过来后利用文件全名进行安装就行了！  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/32c32f513e9be037243f885cd6f4ef11.png)  
这里我也传一个百度网盘的版本。  
链接: [https://pan.baidu.com/s/14-QVk7Kb\_CVwaVZxVPIgtw](https://pan.baidu.com/s/14-QVk7Kb_CVwaVZxVPIgtw)  
提取码: rg2e  
**全部安装完成之后重启电脑。**

#### 3、其它依赖库的安装

但如果想要跑深度学习模型，还有一些其它的依赖库需要安装。具体如下：

```txt
scipy==1.2.1
numpy==1.17.0
matplotlib==3.1.2
opencv_python==4.1.2.30
torch==1.2.0
torchvision==0.4.0
tqdm==4.60.0
Pillow==8.2.0
h5py==2.10.0
```

如果想要更便捷的安装可以在桌面或者其它地方创建一个requirements.txt文件，复制上述内容到txt文件中。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/7f76e6ad79f6bed1e2f4676b627354d3.png)  
使用如下指令安装即可。**下述指令中，requirements.txt前方的路径是我将文件放在桌面的路径，各位同学根据自己的电脑修改。**

```bash
pip install -r C:\Users\33232\Desktop\requirements.txt

```

#### 4、安装较慢请注意换源

需要注意的是，如果在pip中下载安装比较慢可以换个源，可以到用户文件夹下，创建一个pip文件夹，然后在pip文件夹里创建一个txt文件。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/28006284902c6a57318e718daccee1a8.png)  
修改txt文件的内容，并且把后缀改成ini

```bash
[global]
index-url = http://pypi.mirrors.ustc.edu.cn/simple
[install]
use-mirrors =true
mirrors =http://pypi.mirrors.ustc.edu.cn/simple/
trusted-host =pypi.mirrors.ustc.edu.cn
```

![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/783a72953baad1fd9de83303701cbaf8.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/8bd41332dee625e1c6e182608acb9a29.png)  
**全部安装完成之后重启电脑。**

### 四、安装[VSCODE](https://so.csdn.net/so/search?q=VSCODE&spm=1001.2101.3001.7020)

**我个人喜欢VSCODE，所以就安装它啦。其它的编辑软件也可以，个人喜好罢了。**

#### 1、下载安装包安装（推荐）

**最新版本的Anaconda没有VSCODE因此可以直接百度VSCODE进行安装。**

##### a、VSCODE的下载

直接加载VSCODE的官网[https://code.visualstudio.com/](https://code.visualstudio.com/)，点击Download for Windows即可下载。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/f69abbceb271a9dc5d12142e76df4ebc.png)

##### b、VSCODE的安装

首先同意协议，点一下步。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/a80d57bcc63ffc394fb5b59aed099347.png)  
其他里面的几个勾要打起来，因为这样就可以右键文件夹用VSCODE打开，非常方便。下一步。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/4156c82700455d0ab65ea5bb8f68eeb3.png)  
继续下一步安装即可。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/6523e522b685fc8512cacaedfb1934d8.png)

**安装完成后在左下角更改自己的环境就行了。**  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/4a6e8c3ce2dec68836338fdcc57a0dc1.png)

#### 2、anaconda上安装

打开anaconda，切换环境。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/361dd496e006335bd418e8b03e91354e.png)  
安装VSCODE，安装完就可以launch一下了，之后就可以把VScode固定到任务栏上，方便打开。  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/f781c276062dded3ab0d4c9f37aef3bf.png)

 :::important
注：转载自https://blog.csdn.net/weixin_44791964/article/details/106037141
:::
