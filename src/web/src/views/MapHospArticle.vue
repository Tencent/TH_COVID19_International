<template>
    <div class="container">
        <h2 class="art-title">发热地图2.0发布--医院能力升级指引</h2>
        <div class="art-des">2020-02-01</div>
        <div class="art-content">
            <p>
                随着疫情进一步发展，我们收到很多反馈，有很多用户担心自己和亲人朋友是否得了新冠肺炎；同时，医院渐渐出现人满为患的情况，对于患者来说，排队时间长且易交叉感染。
            </p>
            <p>
                成为内测医院，您的医院可以发布人流情况和公告，减少患者交叉感染的可能；同时，您可以给患者一定的就诊建议，方便用户规划自己的就诊安排。
            </p>
            <p class="center">
                <img src="https://static.wecity.qq.com/wuhan/01-a4615684a5c6cadd69769fdc0d05f866.jpg" />
            </p>
            <p>
                若您的医院想成为志愿者，请将以下信息编辑成邮件，发送至：liamzhou@tencent.com或zeyusun@tencent.com审核。
            </p>
            <p class="br">所需信息：</p>
            <p class="br">1、医院名称、联系电话（固话）</p>
            <p class="br">2、医院《医疗机构执业许可证》</p>
            <p class="br">3、医院主页运营负责人姓名，身份证号，联系方式（手机）</p>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data () {
        return {
            dots: []
        }
    },
    async mounted () {
        try {
            await this.initPage()
        } catch (e) {
            console.log('🌟 mounted err: ', e)
        }
    },
    methods: {
        async initPage () {
            document.title = '医院能力升级指引'
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    background: #fff;
    padding: 20px;
    .art-title {
        font-size: 18px;
        line-height: 160%;
        font-weight: bold;
    }
    .art-des {
        color: #999;
        line-height: 40px;
    }
    .art-content {
        font-size: 14px;
        p {
            line-height: 160%;
            margin-bottom: 20px;
            text-indent: 2em;
            word-break: break-all;
            &.br {
                margin: 0;
            }
            &.h1 {
                font-size: 16px;
            }
            &.center {
                text-align: center;
                text-indent: 0;
            }
        }
        p img {
            width: 100%;
            // padding: 0 20px;
            box-sizing: border-box;
        }
    }
}
</style>
