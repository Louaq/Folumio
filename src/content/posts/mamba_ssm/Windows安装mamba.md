---
title: Windows安装mamba
published: 2025-08-23 15:25:00
expires: 2025-09-21 23:59:59
mathjax: true
excerpt: "Windows安装mamba"
category: Mamba
tags: [Mamba]
--- 

  windows系统下安装mamba会遇到各种各样的问题。博主试了好几天，把能踩的坑都踩了，总结出了在windows下安装mamba的一套方法，已经给实验室的windows服务器都装上了。只要跟着我的流程走下来，大概率不会出问题，如果遇到其他问题，可以在评论区讨论，我会的我会回复。 
  首先创建mamba的环境，然后安装必要的库。请你创建一个新环境，而不是用以前的环境，版本这些就跟着这个里面来。

```bash
conda create -n your_env_name python=3.10.13
conda activate your_env_name
conda install cudatoolkit==11.8 -c nvidia
pip install torch==2.1.1 torchvision==0.16.1 torchaudio==2.1.1 --index-url https://download.pytorch.org/whl/cu118
conda install -c "nvidia/label/cuda-11.8.0" cuda-nvcc
conda install packaging
```

  接下来安装 triton包：有大神编译了Windows下二进制文件，在[github](https://github.com/PrashantSaikia/Triton-for-Windows)下载，下载到本地后，在命令行你的环境下，切换到tritan所在文件夹，输入

```bash
pip install triton-2.0.0-cp310-cp310-win_amd64.whl
```

  做完这些之后，现在检查的电脑上的CUDA版本，请看[这篇文章](https://blog.csdn.net/ruvikm/article/details/133430914)，要确定你电脑上的CUDA和你系统环境里面的路径跟他描述的是一致的，并且是11.8，如果不一致，就跟着他的操作流程重新安装CUDA和cudnn。  
  进行完这一步后，如果你现在直接安装causal-conv1d，大概率会报这个错误：  
![在这里插入图片描述](https://pic1.imgdb.cn/i/0343OWFRM7MRvCpk43bXlu.webp)  
  这里有两个原因，一个是我上面提到的电脑上安装的CUDA的问题，安装的不对，如果这一步是对的，那就是VisualStudio的原因，要不你根本就没装VS，如果装了，仔细看报错的细节，你大概率会找到：  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/18a0de90b7554959a2c52707e8ceaff4.png)  
  这是因为你安装的VS版本可能太新了，CUDA不支持，现在VS官网上面直接下载的2022版本就是不支持的，建议安装2019版本，整个都是支持的，官网直接上去已经不能下载老版本了，我找到了一个地方，[2019版本下载](https://learn.microsoft.com/en-us/visualstudio/install/create-a-network-installation-of-visual-studio?view=vs-2019#download-the-visual-studio-bootstrapper-to-create-the-layout)，这里面可以下载2019版本的，没有社区版，不过我们不需要一定是社区版，因为我们不用它，只要安装了那个环境就可以，我下的是专业版，然后按[这个教程](https://zhuanlan.zhihu.com/p/165008313)，他打勾的你打勾，安装完就行了。  
现在我们开始安装causal-conv1d，还是在命令行，跟这个代码：

```bash
git clone https://github.com/Dao-AILab/causal-conv1d.git
cd causal-conv1d
git checkout v1.1.1 # current latest version tag
pip install .
```

  安装完causal-conv1d之后，再安装mamba，首先下载mamba并调整版本：

```bash
cd..
git clone https://github.com/state-spaces/mamba.git
cd mamba
git checkout v1.1.1
```

  然后修改mamba文件夹里的源码，请在mamba官方代码中setup.py文件修改配置:

```bash
FORCE_BUILD = os.getenv("MAMBA_FORCE_BUILD", "FALSE") == "FALSE"
SKIP_CUDA_BUILD = os.getenv("MAMBA_SKIP_CUDA_BUILD", "FALSE") == "FALSE"
```

  然后在mamba\_ssm/ops/selective\_scan\_interface.py该文件中注释掉：

```bash
import selective_scan_cuda
```

将

```python
def selective_scan_fn(u, delta, A, B, C, D=None, z=None, delta_bias=None, delta_softplus=False,
                     return_last_state=False):
    """if return_last_state is True, returns (out, last_state)
    last_state has shape (batch, dim, dstate). Note that the gradient of the last state is
    not considered in the backward pass.
    """
    return SelectiveScanFn.apply(u, delta, A, B, C, D, z, delta_bias, delta_softplus, return_last_state)
 
 
def mamba_inner_fn(
    xz, conv1d_weight, conv1d_bias, x_proj_weight, delta_proj_weight,
    out_proj_weight, out_proj_bias,
    A, B=None, C=None, D=None, delta_bias=None, B_proj_bias=None,
    C_proj_bias=None, delta_softplus=True
):
    return MambaInnerFn.apply(xz, conv1d_weight, conv1d_bias, x_proj_weight, delta_proj_weight,
                              out_proj_weight, out_proj_bias,
                              A, B, C, D, delta_bias, B_proj_bias, C_proj_bias, delta_softplus)
```

改为

```python
def selective_scan_fn(u, delta, A, B, C, D=None, z=None, delta_bias=None, delta_softplus=False,
                     return_last_state=False):
    """if return_last_state is True, returns (out, last_state)
    last_state has shape (batch, dim, dstate). Note that the gradient of the last state is
    not considered in the backward pass.
    """
    return selective_scan_ref(u, delta, A, B, C, D, z, delta_bias, delta_softplus, return_last_state)
 
def mamba_inner_fn(
    xz, conv1d_weight, conv1d_bias, x_proj_weight, delta_proj_weight,
    out_proj_weight, out_proj_bias,
    A, B=None, C=None, D=None, delta_bias=None, B_proj_bias=None,
    C_proj_bias=None, delta_softplus=True
):
    return mamba_inner_ref(xz, conv1d_weight, conv1d_bias, x_proj_weight, delta_proj_weight,
                              out_proj_weight, out_proj_bias,
                              A, B, C, D, delta_bias, B_proj_bias, C_proj_bias, delta_softplus)
```

然后再

```bash
pip install .
```

  如果你是按照我的流程一步一步来的，到这里应该就会成功了：  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/54522f3d443f45cc88fc2f85b3b17afb.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/88d2b5f3de1541049b8e36a0b2914a6c.png)  
  有两个问题，第一，你不能直接pip install .，必须先调整版本，如果你安装的mamba和causal-conv1d版本是不对应的，运行时会有这个报错：

```bash
File "/home/xxx/.conda/envs/mamba/lib/python3.10/site-packages/mamba_ssm/ops/selective_scan_interface.py", line 187, in forward
    conv1d_out = causal_conv1d_cuda.causal_conv1d_fwd(
TypeError: causal_conv1d_fwd(): incompatible function arguments. The following argument types are supported:
    1. (arg0: torch.Tensor, arg1: torch.Tensor, arg2: Optional[torch.Tensor], arg3: Optional[torch.Tensor], arg4: bool) -> torch.Tensor

Invoked with: tensor(
        [-4.9056e-40, -4.9057e-40, -4.9074e-40, -4.9078e-40]], device='cuda:0',
       requires_grad=True), Parameter containing:
tensor([ 0.0322, -0.1139,  0.0770,  ..., -0.0320, -0.1266, -0.1096],
       device='cuda:0', requires_grad=True), None, None, None, True
```

  第二个问题，成功安装之后，你可能会遇到这个报错：  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/540f5207b6ee4c13908e7a445678ddaa.png)  
  这似乎是源码本身的逻辑问题，问题的原因是原始代码的函数输入缺少“seq\_idx”，这会导致传入激活函数“silu”的名称被视为“seq\_idx”，我的解决方法是添加“seq\_idx=None“，这样就可以运行了。  
  之前我有使用自己修改的一个mamba的简单实现版本，用上之后跑的很慢，我才来装mamba，但是装完之后发现这个官方的库在windows上运行一样很慢，还没找到原因，不过好赖是能使了。  
  给出一套测试代码：

```python
import torch
from mamba_ssm import Mamba
 
batch, length, dim = 2, 64, 16
x = torch.randn(batch, length, dim).to("cuda")
model = Mamba(
    # This module uses roughly 3 * expand * d_model^2 parameters
    d_model=dim, # Model dimension d_model
    d_state=16,  # SSM state expansion factor
    d_conv=4,    # Local convolution width
    expand=2,    # Block expansion factor
).to("cuda")
y = model(x)
assert y.shape == x.shape
print('success')
```

---
:::important
按照上述按照完成后，我在本地测试的时候还是会报错，如下图所示：
:::

![Snipaste_2025-08-23_15-02-25](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-08-23_15-02-25.png)



解决方法是，把mamba_ssm/ops/selective_scan_interface.py中第320行的：

```python
x = causal_conv1d_fn(x, rearrange(conv1d_weight, "d 1 w -> d w"), conv1d_bias, "silu")
```

修改为  :

```python
x = causal_conv1d_fn(x, rearrange(conv1d_weight, "d 1 w -> d w"), conv1d_bias, None, "silu") 
```



修改的截图：

![Snipaste_2025-08-23_15-03-48](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-08-23_15-03-48.png)



再次测试时，可以正常使用：

测试脚本：

```python
import torch
from mamba_ssm import Mamba
 
batch, length, dim = 2, 64, 16
x = torch.randn(batch, length, dim).to("cuda")
model = Mamba(
    # This module uses roughly 3 * expand * d_model^2 parameters
    d_model=dim, # Model dimension d_model
    d_state=16,  # SSM state expansion factor
    d_conv=4,    # Local convolution width
    expand=2,    # Block expansion factor
).to("cuda")
y = model(x)
assert y.shape == x.shape
print('success')

```



![Snipaste_2025-08-23_15-02-39](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-08-23_15-02-39.png)

:::important
注：部分内容转载自https://blog.csdn.net/zly_Always_be/article/details/140400011
:::