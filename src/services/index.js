import axios from 'axios'
import dayjs from 'dayjs'
import { JSDOM } from 'jsdom'
import cloneDeep from 'lodash/cloneDeep.js'
import config from '../../config/exp-config.js'
import TEMPLATE_CONFIG from '../../config/template-config.cjs'
import { DEFAULT_OUTPUT, TYPE_LIST, RUN_TIME_STORAGE } from '../store/index.js'
import {
  getConstellation,
  randomNum,
  sortBirthdayTime,
  getColor,
  toLowerLine,
  getWeatherCityInfo,
  sleep,
} from '../utils/index.js'
import { selfDayjs, timeZone } from '../utils/set-def-dayjs.js'

axios.defaults.timeout = 10000

/**
 * 获取 accessToken
 * @returns accessToken
 */
export const getAccessToken = async () => {
  // APP_ID
  const appId = config.APP_ID || process.env.APP_ID
  // APP_SECRET
  const appSecret = config.APP_SECRET || process.env.APP_SECRET
  // accessToken
  let accessToken = null

  // 打印日志
  if (!appId) {
    console.log('未填写appId!! 请检查是否actions secret的变量拼写正确，仔细阅读文档!!', appId)
    return null
  }
  if (!appSecret) {
    console.log('未填写appSecret!! 请检查是否actions secret的变量拼写正确，请仔细阅读文档!!', appId)
    return null
  }

  console.log('已获取appId', appId)
  console.log('已获取appSecret', appSecret)

  const postUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`

  try {
    const res = await axios.get(postUrl).catch((err) => err)
    if (res.status === 200 && res.data && res.data.access_token) {
      accessToken = res.data.access_token
      console.log('---')
      console.log('获取 accessToken: 成功', res.data)
      console.log('---')
    } else {
      console.log('---')
      console.error('获取 accessToken: 请求失败', res.data.errmsg)
      console.log('---')
      console.log(`40001: 请检查appId，appSecret 填写是否正确；
                  如果第一次使用微信测试号请关闭测试号平台后重新扫码登陆测试号平台获取最新的appId，appSecret`)
    }
  } catch (e) {
    console.error('获取 accessToken: ', e)
  }

  return accessToken
}

/**
 * 获取天气icon
 * @param {*} weather
 * @returns
 */
export const getWeatherIcon = (weather) => {
  let weatherIcon = '🌈'
  const weatherIconList = ['☀️', '☁️', '⛅️',
    '☃️', '⛈️', '🏜️', '🏜️', '🌫️', '🌫️', '🌪️', '🌧️']
  const weatherType = ['晴', '阴', '云', '雪', '雷', '沙', '尘', '雾', '霾', '风', '雨']

  weatherType.forEach((item, index) => {
    if (weather.indexOf(item) !== -1) {
      weatherIcon = weatherIconList[index]
    }
  })

  return weatherIcon
}

/**
 * 获取天气情况
 * @param {*} province 省份
 * @param {*} city 城市
 */
export const getWeather = async (province, city) => {
  if (config.SWITCH && config.SWITCH.weather === false) {
    return {}
  }

  // 读取缓存
  if (RUN_TIME_STORAGE[`${province}_${city}`]) {
    console.log(`获取了相同的数据，读取缓存 >>> ${province}_${city}`)
    return RUN_TIME_STORAGE[`${province}_${city}`]
  }

  const cityInfo = getWeatherCityInfo(province, city)
  if (!cityInfo) {
    console.error('配置文件中找不到相应的省份或城市')
    return {}
  }
  const url = `http://t.weather.itboy.net/api/weather/city/${cityInfo.city_code}`

  const res = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((err) => err)

  if (res.status === 200 && res.data && res.data.status === 200) {
    const commonInfo = res.data.data
    const info = commonInfo && commonInfo.forecast && commonInfo.forecast[0]
    if (!info) {
      console.error('天气情况: 找不到天气信息, 获取失败')
      return {}
    }

    const result = {
      // 湿度
      shidu: commonInfo.shidu,
      // PM2.5
      pm25: commonInfo.pm25,
      // PM1.0
      pm10: commonInfo.pm10,
      // 空气质量
      quality: commonInfo.quality,
      // 预防感冒提醒
      ganmao: commonInfo.ganmao,
      // 日出时间
      sunrise: info.sunrise,
      // 日落时间
      sunset: info.sunset,
      // 空气质量指数
      aqi: info.aqi,
      // 天气情况
      weather: info.type,
      // 最高温度
      maxTemperature: info.high.replace(/^高温\s*/, ''),
      // 最低温度
      minTemperature: info.low.replace(/^低温\s*/, ''),
      // 风向
      windDirection: info.fx,
      // 风力等级
      windScale: info.fl,
      // 温馨提示
      notice: info.notice,
    }

    RUN_TIME_STORAGE[`${province}_${city}`] = cloneDeep(result)

    return result
  }
  console.error('天气情况获取失败', res)
  return {}
}


/**
 * 金山词霸每日一句
 * @returns
 */
export const getCIBA = async () => {
  const url = 'http://open.iciba.com/dsapi/'
  const res = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
    },
  }).catch((err) => err)

  if (res.status === 200 && res) {
    return res.data
  }
  console.error('金山词霸每日一句: 发生错误', res)
  return {}
}

/**
 * 获取下一休息日tts
 * @returns
 */
export const getHolidaytts = async () => {
  if (config.SWITCH && config.SWITCH.holidaytts === false) {
    return null
  }
//   let str = "日一二三四五六".charAt(new Date().getDay());
//   if (str == "一") {
//     return "新的一周如期而至，新的祝福接踵而来；物以稀为贵，月以明为贵；秋以爽为贵，友以挚为贵；情以真为贵，我以你为贵！祝新一周事事顺利好心情！";
//   } else if (str == "二") {
//     return "周二文件满天飞，交际应酬排着队，老板背后加紧催，加班加点没人陪，细了腿，痛了背，我送祝福一直追，年少不要徒伤悲，生活以后会更美。";
//   } else if (str == "三") {
//     return "周三啦，事儿不少，有个事情很重要，就是给你送个减压宝，减去丝丝烦恼，减去压力的笼罩，只等你满面红光面带笑！好好工作哦，朋友，我等你在周末的转角！不见不散！！";
//   } else if (str == "四") {
//     return "周四来到，心烦意燥，拼劲早就奄奄一息了，活力早就大伤元气了，自信心早就堕落了，幸亏周五邻近，礼拜天已伸开怀里等候大家，愿你我共勉之，鼓足干劲，轻轻松松度周四!";
//   } else if (str == "五") {
//     return "又到星期五，快乐问候不会土。祝你遇到开心拦路虎，碰到财富好运鼠，邂逅甜蜜爱情鹿，畅饮健康长寿醋，幸福生活你做主!";
//   } else if (str == "六") {
//     return "周六到了，睡就睡个自然醒，乐就乐个乐翻天，笑就笑个花枝颤，玩就玩个天昏暗，闲就闲个活神仙只要你想，快乐就在你身边！";
//   } else if (str == "日") {
//     return "周末来临请做好抗压准备，我将把温馨甜蜜放在你心底，压的你气喘吁吁；把快乐幸福放在你心头，让你毫无招架之力；把吉祥如意装入你身体，弄的你透不过气；把爱神财神和你捆绑在一起，令你寸步难移。只为你将我记起，周末哪能不联系？祝开开心心永甜蜜！";
//   }
//   const url = 'https://wangxinleo.cn/api/wx-push/holiday/getHolidaytts'
//   const res = await axios.get(url).catch((err) => err)

//   if (res.status === 200 && res.data && res.data.code === 0) {
//     return res.data.tts
//   }
//   console.error('获取下一休息日tts: 发生错误', res)
//   return null
	let day1 = new Date();
			day1.setTime(day1.getTime() + 24 * 60 * 60 * 1000);
			let year = day1.getFullYear()
			let month = day1.getMonth() + 1
			let day = day1.getDate();
			month = month < 10 ? "0" + month : month;
			day = day < 10 ? "0" + day : day;
			let ymd = year + "-" + month + "-" + day;
// 				let ymd = "2022-11-08" // 自定义日期-测试

				let str = "日一二三四五六".charAt(new Date(ymd).getDay());

				let week = null
				if (str == "日" || str == "六") {
					week = "今天是周" + str + "放松一下吧！(<ゝω・)☆"
				} else if (str == "一") {
					week = "还有5天才是休息日，刚休息好，一定元气满满，干劲十足吧！"
				} else if (str == "二") {
					week = "还有4天才是休息日，工作忙完，找朋友聊聊天也是挺好的，我一直都在哦！"
				} else if (str == "三") {
					week = "还有3天才是休息日，有我早安，你不孤单！(*❦ω❦)"
				} else if (str == "四") {
					week = "还有2天才是休息日，先好好工作吧！"
				} else if (str == "五") {
					week = "再坚持1天就是休息日了，这周的小目标达成了吗！"
				}

				function getDiffDay(t) {
					// 计算两个日期之间的差值
					let totalDays, diffDate

					let myDate_1 = Date.parse(t)
					let myDate_2 = Date.parse(ymd)
					// 将两个日期都转换为毫秒格式，然后做差
					diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值
					totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
					return totalDays // 相差的天数
				}
				let dateArr = [{
						time: "2023-01-01",
						name: "元旦",
						bless: "今天是元旦，新一年,祝福多多又暖暖！"
					}, {
						time: "2023-01-21",
						name: "除夕",
						bless: "今天是除夕，除夕除烦恼,愿你开心笑！"
					}, {
						time: "2023-01-22",
						name: "除夕",
						bless: "今天是除夕，愿我的祝福像高高低低的风铃,给你带去叮叮铛铛的快乐！"
					}, {
						time: "2023-02-05",
						name: "元宵节",
						bless: "今天是元宵节，愿我的祝福像高高低低的风铃,给你带去叮叮铛铛的快乐！"
					}, {
						time: "2023-05-01",
						name: "劳动节",
						bless: "今天是劳动节，愿我的祝福像高高低低的风铃,给你带去叮叮铛铛的快乐！"
					},
					// ......
				]
				let arr_index = dateArr.findIndex((item) => {
					return item.time >= ymd
				})
				let text = null
				let res = dateArr[arr_index]
        if(arr_index==-1){
          return week+"获取最近节日失败，请前往补充"
        }
				if (res.time == ymd) {
					return res.bless
				} else {
					let res1 = getDiffDay(res.time)
					text = "最近一个节日是" + res.name + "，还有" + res1 + "天，" + (res1 < 3 ? '节日快到了，开心心！' : '还早着呢！')
				
          return week+text
				}
}

/**
 * 每日一言
 * @param {*} type
 * @returns
 */
export const getOneTalk = async (type) => {
  if (config.SWITCH && config.SWITCH.oneTalk === false) {
    return {}
  }

  const filterQuery = TYPE_LIST.filter((item) => item.name === type)
  const query = filterQuery.length ? filterQuery[0].type : TYPE_LIST[randomNum(0, 7)].type
  const url = `https://v1.hitokoto.cn/?c=${query}`

  const res = await axios.get(url).catch((err) => err)

  if (res && res.status === 200) {
    return res.data
  }

  console.error('每日一言: 发生错误', res)
  return {}
}

/**
 * 从沙雕APP开放接口中获取数据
 * @param {'chp' | 'pyq' | 'du'} type
 * @returns {Promise<String>}
 */
export const getWordsFromApiShadiao = async (type) => {
  const typeNameMap = {
    chp: '土味情话(彩虹屁)',
    pyq: '朋友圈文案',
    du: '毒鸡汤',
  }
  if (!['chp', 'pyq', 'du'].includes(type)) {
    console.error('type参数有误，应为chp, pyq, du的其中一个')
    return ''
  }
  const url = `https://api.shadiao.pro/${type}`
  try {
    const res = await axios.get(url, {
      responseType: 'json',
    }).catch((err) => err)
    return (res.data && res.data.data && res.data.data.text) || ''
  } catch (e) {
    console.error(`${typeNameMap[type]}：发生错误`, e)
    return ''
  }
}

/**
 * 土味情话（彩虹屁）
 * @returns {Promise<String>} 土味情话(彩虹屁）内容
 */
export const getEarthyLoveWords = async () => {
  if (config.SWITCH && config.SWITCH.earthyLoveWords === false) {
    return ''
  }
  return getWordsFromApiShadiao('chp')
}

/**
 * 朋友圈文案
 * @returns {Promise<String>} 朋友圈文案内容
 */
export const getMomentCopyrighting = async () => {
  if (config.SWITCH && config.SWITCH.momentCopyrighting === false) {
    return ''
  }

  return getWordsFromApiShadiao('pyq')
}

/**
 * 毒鸡汤
 * @returns {Promise<String>} 毒鸡汤内容
 */
export const getPoisonChickenSoup = async () => {
  if (config.SWITCH && config.SWITCH.poisonChickenSoup === false) {
    return ''
  }

  return getWordsFromApiShadiao('du')
}

/**
 * 古诗古文
 * @returns {Promise<{}|{dynasty: string, author: string, title: string, content: string}>} 古诗内容 标题 作者 朝代
 */
export const getPoetry = async () => {
  if (config.SWITCH && config.SWITCH.poetry === false) {
    return {}
  }

  const url = 'https://v2.jinrishici.com/sentence'
  try {
    const res = await axios.get(url, {
      headers: {
        'X-User-Token': 'FW8KNlfULPtZ9Ci6aNy8aTfPJPwI+/Ln',
      },
      responseType: 'json',
    }).catch((err) => err)
    const { status, data, warning } = res.data || {}
    if (status !== 'success') {
      console.error('古诗古文：发生错误', warning || '')
      return {}
    }
    const { content = '', origin } = data || {}
    const { title = '', author = '', dynasty = '' } = origin || {}
    return {
      content,
      title,
      author,
      dynasty,
    }
  } catch (e) {
    console.error('古诗古文：发生错误', e)
    return {}
  }
}

/**
 * 星座运势请求
 * @param {string} date
 * @param {string} dateType
 * @returns
 */
export const getConstellationFortune = async (date, dateType) => {
  if (config.SWITCH && config.SWITCH.horoscope === false) {
    return []
  }

  const res = []
  if (!date) {
    return res
  }

  const periods = ['今日', '明日', '本周', '本月', '今年']
  const defaultType = [{
    name: '综合运势',
    key: 'comprehensiveHoroscope',
  }, {
    name: '爱情运势',
    key: 'loveHoroscope',
  }, {
    name: '事业学业',
    key: 'careerHoroscope',
  }, {
    name: '财富运势',
    key: 'wealthHoroscope',
  }, {
    name: '健康运势',
    key: 'healthyHoroscope',
  }]

  // 未填写时段，则取今日
  if (!dateType) {
    dateType = '今日'
  }

  const dateTypeIndex = periods.indexOf(dateType)
  if (dateTypeIndex === -1) {
    console.error('星座日期类型horoscopeDateType错误, 请确认是否按要求填写!')
    return res
  }

  // 获取星座id
  const { en: constellation } = getConstellation(date)
  const url = `https://www.xzw.com/fortune/${constellation}/${dateTypeIndex}.html`
  try {
    const { data } = await axios.get(url).catch((err) => err)
    if (data) {
      const jsdom = new JSDOM(data)
      defaultType.forEach((item, index) => {
        let value = jsdom.window.document.querySelector(`.c_cont p strong.p${index + 1}`).nextElementSibling.innerHTML.replace(/<small.*/, '')
        if (!value) {
          value = DEFAULT_OUTPUT.constellationFortune
          console.error(`${item.name}获取失败`)
        }
        res.push({
          name: toLowerLine(item.key),
          value: `${dateType}${item.name}: ${value}`,
          color: getColor(),
        })
      })
    } else {
      // 拿不到数据则拼假数据, 保证运行
      defaultType.forEach((item) => {
        const value = DEFAULT_OUTPUT.constellationFortune
        res.push({
          name: toLowerLine(item.key),
          value: `${dateType}${item.name}: ${value}`,
          color: getColor(),
        })
      })
    }

    return res
  } catch (e) {
    console.error('星座运势：发生错误', e)
    return res
  }
}

/**
 * 获取重要节日信息
 * @param {Array<object>} festivals
 * @return
 */
export const getBirthdayMessage = (festivals) => {
  if (config.SWITCH && config.SWITCH.birthdayMessage === false) {
    return ''
  }

  if (Object.prototype.toString.call(festivals) !== '[object Array]'
    || festivals.length === 0) {
    festivals = null
  }

  // 计算重要节日倒数
  const birthdayList = sortBirthdayTime((festivals || config.FESTIVALS || [])).map((it) => {
    if (!it.useLunar) {
      return it
    }
    const date = selfDayjs().add(it.diffDay, 'day')
    return {
      ...it,
      soarYear: date.format('YYYY'),
      solarDate: date.format('MM-DD'),
    }
  })
  let resMessage = ''

  birthdayList.forEach((item, index) => {
    if (
      !config.FESTIVALS_LIMIT
      || (config.FESTIVALS_LIMIT && index < config.FESTIVALS_LIMIT)
    ) {
      let message = null

      // 生日相关
      if (item.type === '生日') {
        // 获取周岁
        let age
        if (!item.useLunar) {
          age = selfDayjs().diff(`${item.year}-${item.date}`, 'year')
        } else {
          age = selfDayjs().year() - item.year - 1
        }

        if (item.diffDay === 0) {
          message = `今天是 ${item.name} 的${age && item.isShowAge ? `${(item.useLunar ? 1 : 0) + age}岁` : ''}生日哦，祝${item.name}生日快乐！`
        } else {
          message = `距离 ${item.name} 的${age && item.isShowAge ? `${age + 1}岁` : ''}生日还有${item.diffDay}天`
        }
      }

      // 节日相关
      if (item.type === '节日') {
        if (item.diffDay === 0) {
          message = `今天是 ${item.name} 哦，要开心！`
        } else {
          message = `距离 ${item.name} 还有${item.diffDay}天`
        }
      }

      // 存储数据
      if (message) {
        resMessage += `${message} \n`
      }
    }
  })

  return resMessage
}

/**
 * 计算每个重要日子的日期差
 * @params {*} customizedDateList
 * @returns
 */
export const getDateDiffList = (customizedDateList) => {
  if (Object.prototype.toString.call(customizedDateList) !== '[object Array]'
    && Object.prototype.toString.call(config.CUSTOMIZED_DATE_LIST) !== '[object Array]') {
    return []
  }
  const dateList = customizedDateList || config.CUSTOMIZED_DATE_LIST

  dateList.forEach((item) => {
    item.diffDay = Math.ceil(selfDayjs().diff(selfDayjs(item.date), 'day', true))
    if (item.diffDay <= 0) {
      item.diffDay = Math.abs(Math.floor(selfDayjs().diff(selfDayjs(item.date), 'day', true)))
    }
  })

  return dateList
}

/**
 * 自定义插槽信息
 * @returns
 */
export const getSlotList = () => {
  if (Object.prototype.toString.call(config.SLOT_LIST) !== '[object Array]') {
    return []
  }
  const slotList = config.SLOT_LIST

  slotList.forEach((item) => {
    if (Object.prototype.toString.call(item.contents) === '[object Array]' && item.contents.length > 0) {
      item.checkout = item.contents[Math.floor(Math.random() * item.contents.length + 1) - 1]
    } else if (Object.prototype.toString.call(item.contents) === '[object String]') {
      item.checkout = item.contents
    } else {
      item.checkout = ''
    }
  })

  return slotList
}

/**
 * 获取全部处理好的用户数据
 * @returns
 */
// istanbul ignore next
export const getAggregatedData = async () => {
  const weekList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  // 获取金山词霸每日一句
  const {
    content: noteEn = DEFAULT_OUTPUT.noteEn,
    note: noteCh = DEFAULT_OUTPUT.noteCh,
  } = await getCIBA()
  // 获取下一休息日
  const holidaytts = await getHolidaytts() || DEFAULT_OUTPUT.holidaytts
  // 获取每日一言
  const {
    hitokoto: oneTalk = DEFAULT_OUTPUT.oneTalk,
    from: talkFrom = DEFAULT_OUTPUT.talkFrom,
  } = await getOneTalk(config.LITERARY_PREFERENCE)
  // 获取土味情话
  const earthyLoveWords = await getEarthyLoveWords() || DEFAULT_OUTPUT.earthyLoveWords
  // 获取朋友圈文案
  const momentCopyrighting = await getMomentCopyrighting() || DEFAULT_OUTPUT.momentCopyrighting
  // 获取毒鸡汤
  const poisonChickenSoup = await getPoisonChickenSoup() || DEFAULT_OUTPUT.poisonChickenSoup
  // 获取古诗古文 poetry
  const {
    dynasty: poetryDynasty = DEFAULT_OUTPUT.poetryDynasty,
    author: poetryAuthor = DEFAULT_OUTPUT.poetryAuthor,
    title: poetryTitle = DEFAULT_OUTPUT.poetryTitle,
    content: poetryContent = DEFAULT_OUTPUT.poetryContent,
  } = await getPoetry()
  // 获取插槽中的数据
  const slotParams = getSlotList().map((item) => ({ name: item.keyword, value: item.checkout, color: getColor() }))

  if (Object.prototype.toString.call(config.USERS) !== '[object Array]') {
    console.error('配置文件中找不到USERS数组')
    throw new Error('配置文件中找不到USERS数组')
  }
  const users = config.USERS
  for (const user of users) {
    // 获取每日天气
    const weatherInfo = await getWeather(user.province || config.PROVINCE, user.city || config.CITY)
    const weatherMessage = Object.keys(weatherInfo).map((item) => ({
      name: toLowerLine(item),
      value: weatherInfo[item] || '获取失败',
      color: getColor(),
    }))

    // 统计日列表计算日期差
    const dateDiffParams = getDateDiffList(user.customizedDateList).map((item) => ({
      name: item.keyword,
      value: item.diffDay,
      color: getColor(),
    }))

    // 获取生日/生日信息
    const birthdayMessage = getBirthdayMessage(user.festivals)

    // 获取星座运势
    const constellationFortune = await getConstellationFortune(user.horoscopeDate, user.horoscopeDateType)

    // 集成所需信息
    const wxTemplateParams = [
      { name: toLowerLine('toName'), value: user.name, color: getColor() },
      {
        name: toLowerLine('date'),
        value: `${selfDayjs().format('YYYY-MM-DD')} ${weekList[selfDayjs().format('d')]}`,
        color: getColor(),
      },
      { name: toLowerLine('province'), value: user.province || config.PROVINCE, color: getColor() },
      { name: toLowerLine('city'), value: user.city || config.CITY, color: getColor() },
      { name: toLowerLine('birthdayMessage'), value: birthdayMessage, color: getColor() },
      { name: toLowerLine('noteEn'), value: noteEn, color: getColor() },
      { name: toLowerLine('noteCh'), value: noteCh, color: getColor() },
      { name: toLowerLine('holidaytts'), value: holidaytts, color: getColor() },
      { name: toLowerLine('oneTalk'), value: oneTalk, color: getColor() },
      { name: toLowerLine('talkFrom'), value: talkFrom, color: getColor() },
      { name: toLowerLine('earthyLoveWords'), value: earthyLoveWords, color: getColor() },
      { name: toLowerLine('momentCopyrighting'), value: momentCopyrighting, color: getColor() },
      { name: toLowerLine('poisonChickenSoup'), value: poisonChickenSoup, color: getColor() },
      { name: toLowerLine('poetryContent'), value: poetryContent, color: getColor() },
      { name: toLowerLine('poetryAuthor'), value: poetryAuthor, color: getColor() },
      { name: toLowerLine('poetryDynasty'), value: poetryDynasty, color: getColor() },
      { name: toLowerLine('poetryTitle'), value: poetryTitle, color: getColor() },
    ].concat(weatherMessage)
      .concat(constellationFortune)
      .concat(dateDiffParams)
      .concat(slotParams)

    user.wxTemplateParams = wxTemplateParams
  }

  return users
}

/**
 * 本地模板拼装
 * @param templateId
 * @param wxTemplateData
 * @param urlencode
 * @param turnToOA \n转换成 %0A
 * @returns {{title: string, desc: string}|null}
 */
export const model2Data = (templateId, wxTemplateData, urlencode = false, turnToOA = false) => {
  if (!templateId || !wxTemplateData) {
    console.log('templateId:', templateId)
    console.log('wxTemplateData:', wxTemplateData)
    console.log('发生错误，templateId 或 wxTemplateData 不能为 null')
    return null
  }
  let targetValue = null
  // 获取模板
  const model = TEMPLATE_CONFIG.find((o) => o.id === templateId)

  if (!model) {
    console.log(`TEMPLATE_CONFIG中找不到模板id为 ${templateId} 的模板`)
    return null
  }

  // 替换模板
  targetValue = model.desc.replace(/[{]{2}(.*?).DATA[}]{2}/gm, (paramText) => {
    // 提取变量
    const param = paramText.match(/(?<=[{]{2})(.*?)(?=.DATA[}]{2})/g)
    if (param && param[0]) {
      const replaceText = wxTemplateData[param[0]]
      return replaceText && (replaceText.value || replaceText.value === 0) ? replaceText.value : ''
    }
    return ''
  })

  // 统一格式
  targetValue = JSON.stringify(targetValue).replace(/(?<=\\n|^)[ ]{1,}/gm, '')
  // 去除前后双引号
  targetValue = targetValue.substring(1, targetValue.length - 1)

  // urlencode
  if (urlencode) {
    model.title = encodeURI(model.title)
    targetValue = encodeURI(targetValue)
  }

  // \n转换成 %0A
  if (turnToOA) {
    targetValue = targetValue.replace(/%5Cn+/g, '%0A%0A')
  }

  return {
    title: model.title,
    desc: targetValue,
  }
}

/**
 * 获取处理好的回执消息
 * @param {*} messageReply
 * @returns
 */
// istanbul ignore next
export const getCallbackTemplateParams = (messageReply) => {
  const postTimeZone = timeZone()
  const postTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  return [
    { name: toLowerLine('postTimeZone'), value: postTimeZone, color: getColor() },
    { name: toLowerLine('postTime'), value: postTime, color: getColor() },
    { name: toLowerLine('needPostNum'), value: messageReply.needPostNum, color: getColor() },
    { name: toLowerLine('successPostNum'), value: messageReply.successPostNum, color: getColor() },
    { name: toLowerLine('failPostNum'), value: messageReply.failPostNum, color: getColor() },
    { name: toLowerLine('successPostIds'), value: messageReply.successPostIds, color: getColor() },
    { name: toLowerLine('failPostIds'), value: messageReply.failPostIds, color: getColor() },
  ]
}

// 组装openUrl
const assembleOpenUrl = () => ''

/**
 * 使用pushDeer
 * @param user
 * @param templateId
 * @param wxTemplateData
 * @returns {Promise<{success: boolean, name}>}
 */
const sendMessageByPushDeer = async (user, templateId, wxTemplateData) => {
  // 模板拼装
  const modelData = model2Data(templateId, wxTemplateData, true, true)
  if (!modelData) {
    return {
      name: user.name,
      success: false,
    }
  }

  const url = `https://api2.pushdeer.com/message/push?pushkey=${user.id}&text=${modelData.title}&desp=${modelData.desc}&type=markdown`

  // 发送消息
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
    },
  }).catch((err) => err)

  if (res.data && res.data.code === 0) {
    console.log(`${user.name}: 推送消息成功`)
    return {
      name: user.name,
      success: true,
    }
  }
  console.error(`${user.name}: 推送消息失败`, res)
  return {
    name: user.name,
    success: false,
  }
}

/**
 * 使用wechat-test
 * @param user
 * @param templateId
 * @param wxTemplateData
 * @returns {Promise<{success: boolean, name}>}
 */
const sendMessageByWeChatTest = async (user, templateId, wxTemplateData) => {
  let accessToken = null

  if (RUN_TIME_STORAGE.accessToken) {
    accessToken = RUN_TIME_STORAGE.accessToken
  } else {
    accessToken = await getAccessToken()
    RUN_TIME_STORAGE.accessToken = accessToken
  }

  if (!accessToken) {
    return {
      name: user.name,
      success: false,
    }
  }

  const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`
  const data = {
    touser: user.id,
    template_id: templateId,
    url: assembleOpenUrl(),
    topcolor: '#FF0000',
    data: wxTemplateData,
  }

  // 发送消息
  const res = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
    },
  }).catch((err) => err)

  if (res.data && res.data.errcode === 0) {
    console.log(`${user.name}: 推送消息成功`)
    return {
      name: user.name,
      success: true,
    }
  }

  if (res.data && res.data.errcode === 40003) {
    console.error(`${user.name}: 推送消息失败! id填写不正确！应该填用户扫码后生成的id！要么就是填错了！请检查配置文件！`)
  } else if (res.data && res.data.errcode === 40036) {
    console.error(`${user.name}: 推送消息失败! 模板id填写不正确！应该填模板id！要么就是填错了！请检查配置文件！`)
  } else {
    console.error(`${user.name}: 推送消息失败`, res.data)
  }

  return {
    name: user.name,
    success: false,
  }
}

/**
 * 执行发送消息
 * @param templateId
 * @param user
 * @param params
 * @param usePassage
 * @returns {Promise<{success: boolean, name}>}
 */
export const sendMessage = async (templateId, user, params, usePassage) => {
  const wxTemplateData = {}
  if (Object.prototype.toString.call(params) === '[object Array]') {
    params.forEach((item) => {
      wxTemplateData[item.name] = {
        value: item.value,
        color: item.color,
      }
    })
  }

  if (usePassage === 'push-deer') {
    console.log('使用push-deer推送')
    return sendMessageByPushDeer(user, templateId, wxTemplateData)
  }

  console.log('使用微信测试号推送')
  return sendMessageByWeChatTest(user, templateId, wxTemplateData)
}

/**
 * 推送消息, 进行成功失败统计
 * @param users
 * @param templateId
 * @param params
 * @param usePassage
 * @returns {Promise<{failPostIds: (string|string), failPostNum: number, successPostIds: (string|string), needPostNum: *, successPostNum: number}>}
 */
export const sendMessageReply = async (users, templateId = null, params = null, usePassage = null) => {
  const allPromise = []
  const needPostNum = users.length
  let successPostNum = 0
  let failPostNum = 0
  const successPostIds = []
  const failPostIds = []
  const maxPushOneMinute = typeof config.MAX_PUSH_ONE_MINUTE === 'number' && config.MAX_PUSH_ONE_MINUTE > 0 ? config.MAX_PUSH_ONE_MINUTE : 5
  for (const user of users) {
    if (RUN_TIME_STORAGE.pushNum >= maxPushOneMinute) {
      RUN_TIME_STORAGE.pushNum = 0
      // 请求超过N个则等待60秒再发送
      console.log(`单次脚本已发送 ${maxPushOneMinute} 条消息，为避免推送服务器识别为恶意推送，脚本将休眠 ${config.SLEEP_TIME ? config.SLEEP_TIME / 1000 : 65} 秒。休眠结束后将自动推送剩下的消息。`)
      await sleep(config.SLEEP_TIME || 65000)
    }
    resList.push(await sendMessage(
      templateId || user.useTemplateId,
      user,
      params || user.wxTemplateParams,
      usePassage,
    ))
    if (RUN_TIME_STORAGE.pushNum) {
      RUN_TIME_STORAGE.pushNum += 1
    } else {
      RUN_TIME_STORAGE.pushNum = 1
    }
  }
  resList.forEach((item) => {
    if (item.success) {
      successPostNum++
      successPostIds.push(item.name)
    } else {
      failPostNum++
      failPostIds.push(item.name)
    }
  })

  return {
    needPostNum,
    successPostNum,
    failPostNum,
    successPostIds: successPostIds.length ? successPostIds.join(',') : '无',
    failPostIds: failPostIds.length ? failPostIds.join(',') : '无',
  }
}
