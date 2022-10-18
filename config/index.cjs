/* eslint-disable */

/**
 * 此项目配置为方便新人使用，已缩减至最简配置。
 * 如若想使用更多功能，请查考文档中的 【3. config参数说明】 
 * 自行添加属性，以支持更多个性化功能
 */
const USER_CONFIG ={
	"APP_ID": "wxa093d71ec9c445eb",
	"APP_SECRET": "be4e4d95de5c413ef390074f780dea10",
	"IS_SHOW_COLOR": true,
	"CALLBACK_TEMPLATE_ID": "",
	"CALLBACK_USERS": [{
		"name": "自己",
		"id": ""
	}],
	"USERS": [{
		"name": "想",
		"id": "ollwI6lvhiaKp6-Yifu8jsXw3SNs",
		"useTemplateId": "LUTXFrKdGZfycODHki0OUMkHcn6C56h-DoqL4st6V9Q",
		"province": "浙江",
		"city": "杭州",
		"horoscopeDate": "10-11",
		"horoscopeDateType": "今日",
		"openUrl": "https://shuangxunian.github.io/",
		"festivals": [{
			"type": "*生日",
			"name": "嗯嗯",
			"date": "10-12",
			"year": "2022"
		}],
		"customizedDateList": []
	}],
	"SWITCH": {
		"weather": true,
		"holidaytts": true,
		"CIBA": true,
		"oneTalk": false,
		"earthyLoveWords": false,
		"momentCopyrighting": false,
		"poisonChickenSoup": false,
		"poetry": false,
		"horoscope": false,
		"birthdayMessage": true
	}
}

module.exports = USER_CONFIG

