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
      useTemplateId: 'hYLo6eUqBtj0gaAv_Ju5CZM3jsMyhCspyLMDYyHFZiM',
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
      useTemplateId: 'hYLo6eUqBtj0gaAv_Ju5CZM3jsMyhCspyLMDYyHFZiM',
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
      useTemplateId: 'hYLo6eUqBtj0gaAv_Ju5CZM3jsMyhCspyLMDYyHFZiM',
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
	'本想对你回眸一笑，没想天冷冒出个鼻涕泡',
	      '人向前走，苦才会退后。',

'所有的道别里，我最喜欢“明天见”。',

'你此刻所经历的磨难，未来都会成为你的下酒菜。',

'躲起来的星星也在努力发光，你也要努力加油。',

'难熬的日子总会过去，不信你回头看看，你都已经在不知不觉中，熬过了很多苦难，很棒吧。',

'别气馁呀，你的好运正在披荆斩棘得向你跑过来哦。',

'你被黑暗敲打，恰恰说明你是光明本身。',

'我在人间贩卖黄昏，只为收集世间温柔去见你。',

'不管今日做错了什么，你的被窝都会原谅你，晚安好梦。',

'每件事到最后一定会变成一件好事，如果不是，说明还没到最后。',

'做一个明媚的女子，不倾国，不倾城，却倾其所有去坚强。',

'走了那么远路，发现家才是最温暖的。见了那么多人，发现母亲的笑容才是最美丽的。',

'只要路是对的，就不要害怕它是短暂还是遥远，因为你终究会到达。',

'愿你所失去的，都会以另一种方式归来。',

'生活再平凡，也是限量版，请善待自己。',

'凡是过往，皆为序章，所有将来，皆为可盼。',

'但愿日子都是清透，抬头遇见的都是柔情。',

'花不一定是为了花店而开，我一定是为你而来。',

'愿你的生活常温暖，日子总是温柔又闪光。',

'愿你能成为自己的英雄，不惧离别不怕孤独。',

'生活是灯，工作是油，若要灯亮，就得加油。',

'你要一直努力，因为有一天你也是别人的梦想。',

'不一定每天都很好，但每天都会有些小美好在等你。',

'谁不是一边燃一边丧，一边拼命一边又不想活了，但是来人间一趟你要看看太阳。',

'你一定要站在自己所热爱的世界里，闪闪发光。',

'留着你心里的那道光吧，未来要有人靠它穿过黑暗呢。',

'如果要一辈子都缩在阴影里，我宁愿去试着享受那刺眼的阳光。',

'无论现在多么的不开心，你要相信，明天会比今天更好。',

'我不懂什么年少轻狂，我只知道胜者为王。',

'人不是因为没有信念而失败，而是因为不能把信念化成行动，并坚持到底。',

'有人风雨夜行，有人梦里点灯。哪怕前方泥泞不堪，也愿你风雨兼程。',

'光打在你身后，墙上便有了巨大的身影。',

'没有人可以和生活讨价还价，所以只要活着，就一定要努力。',

'没有翻不过的山，没有跨不过的海，只有摧不毁的意志。',

'无论生活给予你什么，你都坦然地接受，那便是勇敢。',

'生活中值得高兴的事情太多，别把目光都盯在那些让你不愉快的事情上。',

'最好的人生，不是一马平川没有障碍，而是跨过或者绕过路障继续向前。',

'先努力让自己发光，对的人才能迎着光而来。',

'要相信最好的自己，不负期待。',

'日子匆忙，不要错过落日与夕阳。',

'不管你被贴上什么标签，只有你才能定义自己。',

'成功其实很简单，就是当你坚持不住的时候，再坚持一下。',

'再好的种子，不播种下去，也结不出丰硕的果实。',

'不管昨夜遇见了怎样的泣不成声，早晨起来这个城市依旧车水马龙。',

'如果别人朝你扔石头，就不要扔回去了，留作你建高楼的基石。',

'做事果敢且有温度，为人柔软而有原则。',

'他们试图把你埋了，但不要忘记你是种子。',

'忠于你的梦想，别管它发不发光。',

'生命只有一次 你要活得畅快淋漓。',

'半山腰有什么好看的，我们山顶见。',
      ],
    }
    // 你可以不断按格式往下增加
    // ...
  ],
}

module.exports = USER_CONFIG

