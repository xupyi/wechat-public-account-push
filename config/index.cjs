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
	"CALLBACK_TEMPLATE_ID": "9hJ_1VMWxpqL1Pz8Jg_1ciiNoWDjVWdmVwi6bMgeZm0",
	"CALLBACK_USERS": [{
		"name": "自己",
		"id": "ollwI6lvhiaKp6-Yifu8jsXw3SNs"
	}],
	"USERS": [{
		"name": "徐鹏毅",
		"id": "ollwI6lvhiaKp6-Yifu8jsXw3SNs",
		"useTemplateId": "9hJ_1VMWxpqL1Pz8Jg_1ciiNoWDjVWdmVwi6bMgeZm0",
		"province": "上海",
		"city": "上海",
		"horoscopeDate": "09-10",
		"horoscopeDateType": "今日",
		"openUrl": "https://baidu.com",
		"festivals": [{
			"type": "*生日",
			"name": "生日0-0",
			"date": "10-31",
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
		"poisonChickenSoup": true,
		"poetry": true,
		"horoscope": false,
		"birthdayMessage": true
	}
}

module.exports = USER_CONFIG

