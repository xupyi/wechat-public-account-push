/* eslint-disable */

/**
 * 此项目配置为方便新人使用，已缩减至最简配置。
 * 如若想使用更多功能，请查考文档中的 【3. config参数说明】 
 * 自行添加属性，以支持更多个性化功能
 */
const USER_CONFIG ={
	
	"SWITCH": {
		"weather": true,
		"holidaytts": true,
		"CIBA": true,
		"oneTalk": false,
		"earthyLoveWords": false,
		"momentCopyrighting": false,
		"poisonChickenSoup": true,
		"poetry": true,
		"horoscope": false,
		"birthdayMessage": true
	},
	 // 使用微信测试号：公众号APP_ID
  APP_ID: 'wxa093d71ec9c445eb',

  // 使用微信测试号：公众号APP_SECRET
  APP_SECRET: 'be4e4d95de5c413ef390074f780dea10',

  PROVINCE: '上海',
  CITY: '上海',

  USERS: [
    {
      // 想要发送的人的名字
      name: '宝贝',
      // 使用微信测试号：扫码关注你的微信测试号后生成的一段字符串，在测试号后台能看到
      id: 'ollwI6lvhiaKp6-Yifu8jsXw3SNs',
      // 使用微信测试号：你想对他发送的模板消息的模板ID
      useTemplateId: '9hJ_1VMWxpqL1Pz8Jg_1ciiNoWDjVWdmVwi6bMgeZm0',
      // 新历生日, 仅用作获取星座运势, 格式必须为MM-DD
      horoscopeDate: '09-10',
      festivals: [
        // 注意：此条配置日期为阴历日期，因为`type`中 “生日” 之前有 * 符号
        {
          type: '*生日', name: '宝贝', year: '1996', date: '09-09',
        },
        // 注意：此条配置日期为阳历日期，因为`type`中 “生日” 之前没有 * 符号
        {
          type: '生日', name: '李四', year: '1996', date: '09-31',
        },
        {
          type: '节日', name: '相识纪念日', year: '2020', date: '09-03',
        },
      ],
      // 我们在一起已经有xxxx天了的配置
      customizedDateList: [
        // 在一起的日子
        { keyword: 'love_day', date: '2022-09-08' },
        // 结婚纪念日
        { keyword: 'marry_day', date: '2012-09-09' },
      ],
    },
  ],
}

module.exports = USER_CONFIG

