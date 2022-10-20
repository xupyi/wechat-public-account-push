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
      name: '我',
      // 使用微信测试号：扫码关注你的微信测试号后生成的一段字符串，在测试号后台能看到
      id: 'ollwI6lvhiaKp6-Yifu8jsXw3SNs',
      // 使用微信测试号：你想对他发送的模板消息的模板ID
      useTemplateId: 'hYG0Qt6goocKMeoArB1ah3hruSQ7rWFenX5gZ8gBh5E',
      // 新历生日, 仅用作获取星座运势, 格式必须为MM-DD
      horoscopeDate: '09-10',
      festivals: [
        // 注意：此条配置日期为阴历日期，因为`type`中 “生日” 之前有 * 符号
        {
          type: '*生日', name: '小乔宝贝', year: '1997', date: '01-04',
        },
         // 注意：此条配置日期为阴历日期，因为`type`中 “生日” 之前有 * 符号
        {
          type: '*生日', name: '刘茵宝贝', year: '1998', date: '03-20',
        },
        
      ],
      // 我们在一起已经有xxxx天了的配置
      customizedDateList: [
        // 在一起的日子
        { keyword: 'love_day', date: '2013-09-01' },
      ],
    },
	  {
      // 想要发送的人的名字
      name: '小乔',
      // 使用微信测试号：扫码关注你的微信测试号后生成的一段字符串，在测试号后台能看到
      id: 'ollwI6kn68_nf2XVzj4n0om8i3_I',
      // 使用微信测试号：你想对他发送的模板消息的模板ID
      useTemplateId: 'hYG0Qt6goocKMeoArB1ah3hruSQ7rWFenX5gZ8gBh5E',
      // 新历生日, 仅用作获取星座运势, 格式必须为MM-DD
      horoscopeDate: '09-10',
      festivals: [
        // 注意：此条配置日期为阴历日期，因为`type`中 “生日” 之前有 * 符号
        {
          type: '*生日', name: '小乔宝贝', year: '1997', date: '01-04',
        },
        
      ],
      // 我们在一起已经有xxxx天了的配置
      customizedDateList: [
        // 在一起的日子
        { keyword: 'love_day', date: '2013-09-01' },
      ],
    },
	    {
      // 想要发送的人的名字
      name: '刘茵',
      // 使用微信测试号：扫码关注你的微信测试号后生成的一段字符串，在测试号后台能看到
      id: 'ollwI6ilJKtKomzUMocsTLm3-v-A',
      // 使用微信测试号：你想对他发送的模板消息的模板ID
      useTemplateId: 'hYG0Qt6goocKMeoArB1ah3hruSQ7rWFenX5gZ8gBh5E',
      // 新历生日, 仅用作获取星座运势, 格式必须为MM-DD
      horoscopeDate: '09-10',
      festivals: [
       
         // 注意：此条配置日期为阴历日期，因为`type`中 “生日” 之前有 * 符号
        {
          type: '*生日', name: '刘茵宝贝', year: '1998', date: '03-20',
        },
        
      ],
      // 我们在一起已经有xxxx天了的配置
      customizedDateList: [
        // 在一起的日子
        { keyword: 'love_day', date: '2013-09-01' },
      ],
    },
  ],
	/** 插槽 */

  /** 你可以在这里写超多的你想显示的内容了！
   * keyword是指暴露给测试号的模板字段，填什么就暴露什么, 请注意不要和README的出参表中的字段重复。
   * 比如：keyword: "lover_prattle" ，在测试号中就是 {{ lover_prattle.DATA }}
   * */
  SLOT_LIST: [
    // 这样配置的话，就会每次随机选一句话发送
    {
      keyword: 'lover_prattle',
      contents: [
        '因为太喜欢你，所以看谁都像是情敌。',
        '申请成为你爱里的永久居民。',
        '你很傻，你很笨，可我还是很羡慕你，因为你有我',
        '遇见你，就好像捡到了100斤的运气',
	'外界的声音都是参考，你不开心就不要参考',
	'本想对你回眸一笑，没想天冷冒出个鼻涕泡'
      ],
    }
    // 你可以不断按格式往下增加
    // ...
  ],
}

module.exports = USER_CONFIG

