<template>
    <div class="disease">
        我是医院列表
    </div>
</template>

<script>
import httpUtils from '@/api'
export default {
    data () {
        return {
            residue: false,
            showMask: false,
            cover: false,
            tab: 1,
            summary: {},
            listData1: [
                {
                    time: '1-21 21:20',
                    tiltle: '重庆确诊5例新冠肺炎#病例：均有武汉工作史或居住史',
                    text:
                        '重庆卫健委网站消息，今晚，国家卫健委确认重庆市首例输入性新型冠状病毒感染的肺炎确诊病例。患者为44岁女性，巫山县人，15日自武汉返回巫山县后，因发热、乏力等症状，于当日在巫山县一发热门诊就诊后即被收治入院隔离治疗。另外，经重庆市疾控中心实验室检测，市诊断专家组评估确认新型冠状病毒感染的肺炎确诊病例4例。截至今晚18时，重庆累计报告新型冠状病毒感染的肺炎确诊病例5例。',
                    source: '信息来源：央视新闻微博'
                },
                {
                    time: '1-21 21:00',
                    tiltle: '新加坡发现7例疑似新冠肺炎#病例',
                    text:
                        '目前，新加坡发现7例疑似新型冠状病毒感染的肺炎病例。新加坡卫生部宣布，从明天起，将对所有来自中国的旅客实行体温检测，此前仅限于武汉。在到访中国后的两周内出现肺炎症状的患者，都将被隔离在医院。',
                    source: '信息来源：央视新闻微博'
                },
                {
                    time: '1-21 20:24',
                    tiltle: '国家医保局：对#确诊为新冠肺炎患者特殊报销#政策',
                    text:
                        '针对此次疫情特点，医保局决定对确诊为“新型冠状病毒感染肺炎”等患者采取特殊报销政策。①将国家卫生健康委《新型冠状病毒感染的肺炎诊疗方案》覆盖的药品和医疗服务项目，全部临时纳入医保基金支付范围。②保证及时支付患者费用，特别是发挥医疗救助资金的兜底保障作用，打消患者就医顾虑。对异地就医患者先救治后结算，报销不再执行异地转外就医支付比例调减规定，减少患者流动带来的传染风险。③对集中收治的医院，医保部门将预付资金减轻医院垫付压力，患者医疗费用不再纳入医院总额预算控制指标。',
                    source: '信息来源：央视新闻微博'
                },
                {
                    time: '1-21 19:45',
                    tiltle: '民航局称#涉及武汉航班可免费办退票#',
                    text:
                        '民航局下发通知，要求各运输航空公司在做好新型冠状病毒感染的肺炎疫情防控工作的同时，高度重视旅客服务工作，针对已经购买涉及武汉航班机票的旅客，如有退票要求，航空公司应当予以免费办理。',
                    source: '信息来源：央视新闻微博'
                },
                {
                    time: '1-21 19:42',
                    tiltle: '河南确诊首例新冠肺炎# 在武汉工作',
                    text:
                        '据@河南省卫生健康委  今天，国家卫生健康委确认河南省郑州市首例输入性新型冠状病毒感染的肺炎确诊病例。患者为男性，66岁，周口太康人，在武汉市工作，2019年12月29日出现发热、胸闷气短等症状，2020年1月7日返回周口市就诊。1月10日转诊至郑州，1月20日患者转运至定点医院隔离治疗。目前患者正在隔离治疗，病情稳定。',
                    source: '信息来源：央视新闻微博'
                },
                {
                    time: '1-21 19:30',
                    tiltle: '河南郑州确诊首例新型冠状病毒肺炎病例',
                    text: '国家卫生健康委确认河南省郑州市首例输入性新型冠状病毒感染的肺炎确诊病例。',
                    source: '河南省卫生健康委微博'
                }
                // {
                //     time: '',
                //     tiltle: '',
                //     text: '',
                //     source: '',
                // },
            ],
            listData2: [
                {
                    text: '武汉肺炎疫情拉响警报！国家卫健委主任挂帅，像全国人民',
                    source: '腾讯医典微信公众号',
                    img:
                        'https://pics6.baidu.com/feed/8694a4c27d1ed21bf3b15d9ed79bcbc250da3f48.jpeg?token=8b7879d3d3f734d65084e29410ae8095&s=B922479054407EE41207F4C70300C0AB'
                }
            ]
        }
    },
    async mounted () {
        try {
            await this.initPage()
        } catch (e) {
            console.log('🌟 mounted err: ', e)
        }
    },
    computed: {
        provinceSituationArr () {
            return (
                (this.summary &&
                    this.summary.provinceSituation &&
                    this.summary.provinceSituation.situation &&
                    this.summary.provinceSituation.situation.split('$$')) ||
                []
            )
        }
    },
    methods: {
        async initPage () {
            await this.getPageInfo()
        },
        async getPageInfo () {
            this.summary = await httpUtils('getSummary')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~Styles/views/disease/index';
</style>
