export interface BatteryInputs {
  age: number
  sleepHours: number
  exerciseFreq: number // 0-7 days per week
  workHoursPerDay: number
  commuteMinutes: number
  screenHoursAfterWork: number
  socialFreq: number // 0=几乎没有 1=偶尔 2=经常 3=频繁
  diet: number // 0=外卖为主 1=有时自己做 2=经常自己做 3=非常健康
  hobby: number // 0=没有 1=有但没时间 2=有且偶尔做 3=经常做
  relationship: number // 0=单身且不想 1=单身想脱单 2=恋爱中/已婚幸福 3=恋爱中/已婚很幸福
  savings: number // 0=月光 1=略有结余 2=有一定存款 3=财务自由
  mentalHealth: number // 0=经常焦虑 1=偶尔焦虑 2=比较平和 3=心态很好
  jobSatisfaction: number // 0=想跑路 1=将就 2=还行 3=很喜欢
  livingAlone: boolean
  hasPets: boolean
  drinkWater: number // 0=<1L 1=1-2L 2=2-3L 3=>3L
  caffeine: number // 0=不喝 1=偶尔 2=每天1-2杯 3=续命级
}

export interface BatteryResult {
  totalBattery: number // 0-100
  breakdown: {
    category: string
    label: string
    score: number
    maxScore: number
    emoji: string
    comment: string
  }[]
  level: 'critical' | 'low' | 'medium' | 'good' | 'excellent'
  title: string
  description: string
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

export function calculateBattery(inputs: BatteryInputs): BatteryResult {
  const breakdown: BatteryResult['breakdown'] = []

  // 1. Sleep score (max 18)
  const sleepOptimal = 7.5
  const sleepDiff = Math.abs(inputs.sleepHours - sleepOptimal)
  let sleepScore: number
  if (sleepDiff <= 0.5) sleepScore = 18
  else if (sleepDiff <= 1) sleepScore = 15
  else if (sleepDiff <= 1.5) sleepScore = 12
  else if (sleepDiff <= 2) sleepScore = 8
  else sleepScore = 4
  
  const sleepComment = sleepScore >= 15 ? '睡眠充足，电量稳定输出' :
    sleepScore >= 12 ? '偶尔熬夜，充电效率一般' :
    sleepScore >= 8 ? '长期睡眠不足，电量快速下降' :
    '严重缺觉，电池已经鼓包了'
  
  breakdown.push({
    category: 'sleep',
    label: '睡眠充电',
    score: sleepScore,
    maxScore: 18,
    emoji: sleepScore >= 15 ? '😴' : sleepScore >= 8 ? '🥱' : '💀',
    comment: sleepComment,
  })

  // 2. Work drain (max 15)
  let workScore: number
  if (inputs.workHoursPerDay <= 7) workScore = 15
  else if (inputs.workHoursPerDay <= 8) workScore = 13
  else if (inputs.workHoursPerDay <= 9) workScore = 10
  else if (inputs.workHoursPerDay <= 10) workScore = 7
  else if (inputs.workHoursPerDay <= 12) workScore = 4
  else workScore = 1

  const commutePenalty = Math.floor(inputs.commuteMinutes / 30) * 1.5
  workScore = Math.max(1, workScore - commutePenalty)

  const workComment = workScore >= 13 ? '到点下班，电量消耗可控' :
    workScore >= 10 ? '偶尔加班，电量缓慢下降' :
    workScore >= 7 ? '996福报享受中，电量告急' :
    '你不是在工作，你是在燃烧'

  breakdown.push({
    category: 'work',
    label: '工作耗电',
    score: clamp(Math.round(workScore), 0, 15),
    maxScore: 15,
    emoji: workScore >= 13 ? '💼' : workScore >= 7 ? '😮‍💨' : '🔥',
    comment: workComment,
  })

  // 3. Exercise (max 12)
  let exerciseScore: number
  if (inputs.exerciseFreq >= 5) exerciseScore = 12
  else if (inputs.exerciseFreq >= 3) exerciseScore = 10
  else if (inputs.exerciseFreq >= 2) exerciseScore = 7
  else if (inputs.exerciseFreq >= 1) exerciseScore = 4
  else exerciseScore = 1

  const exerciseComment = exerciseScore >= 10 ? '运动达人，快充模式开启' :
    exerciseScore >= 7 ? '有运动意识，充电速度尚可' :
    exerciseScore >= 4 ? '办公室久坐选手，充电线接触不良' :
    '运动？那是什么能吃吗？'

  breakdown.push({
    category: 'exercise',
    label: '运动快充',
    score: exerciseScore,
    maxScore: 12,
    emoji: exerciseScore >= 10 ? '🏃' : exerciseScore >= 4 ? '🚶' : '🛋️',
    comment: exerciseComment,
  })

  // 4. Social & Relationship (max 12)
  let socialScore = inputs.socialFreq * 2 + (inputs.relationship >= 2 ? 4 : inputs.relationship === 1 ? 2 : 1)
  if (inputs.livingAlone && inputs.socialFreq === 0) socialScore = Math.max(1, socialScore - 2)
  if (inputs.hasPets) socialScore += 2
  socialScore = clamp(socialScore, 0, 12)

  const socialComment = socialScore >= 10 ? '社交能量满格，人际关系是充电宝' :
    socialScore >= 7 ? '有一定社交圈，偶尔充充电' :
    socialScore >= 4 ? '社交有限，能量主要靠自己发电' :
    '社恐+独居，电量全靠自给自足'

  breakdown.push({
    category: 'social',
    label: '社交能量',
    score: socialScore,
    maxScore: 12,
    emoji: socialScore >= 10 ? '🥳' : socialScore >= 4 ? '🙂' : '🧊',
    comment: socialComment,
  })

  // 5. Diet & Water (max 10)
  let dietScore = inputs.diet * 2 + inputs.drinkWater * 1
  if (inputs.caffeine === 3) dietScore -= 1 // too much caffeine
  if (inputs.caffeine === 2) dietScore += 1 // moderate caffeine helps
  dietScore = clamp(dietScore, 0, 10)

  const dietComment = dietScore >= 8 ? '饮食健康，电池保养得当' :
    dietScore >= 5 ? '饮食一般，电池正常损耗' :
    dietScore >= 3 ? '外卖续命，电池加速老化' :
    '垃圾食品+不喝水，电池即将报废'

  breakdown.push({
    category: 'diet',
    label: '饮食供能',
    score: dietScore,
    maxScore: 10,
    emoji: dietScore >= 8 ? '🥗' : dietScore >= 5 ? '🍜' : '🍔',
    comment: dietComment,
  })

  // 6. Mental Health (max 13)
  let mentalScore = inputs.mentalHealth * 3 + inputs.jobSatisfaction * 1.5
  if (inputs.hobby >= 2) mentalScore += 2
  mentalScore = clamp(Math.round(mentalScore), 0, 13)

  const mentalComment = mentalScore >= 11 ? '心态稳如老狗，内心电量充沛' :
    mentalScore >= 8 ? '偶有焦虑，但整体可控' :
    mentalScore >= 5 ? '精神内耗严重，电量在隐性流失' :
    '焦虑爆表，电池已进入保护模式'

  breakdown.push({
    category: 'mental',
    label: '心理电量',
    score: mentalScore,
    maxScore: 13,
    emoji: mentalScore >= 11 ? '🧘' : mentalScore >= 5 ? '😶' : '🌀',
    comment: mentalComment,
  })

  // 7. Screen time drain (max 10)
  let screenScore: number
  if (inputs.screenHoursAfterWork <= 1) screenScore = 10
  else if (inputs.screenHoursAfterWork <= 2) screenScore = 8
  else if (inputs.screenHoursAfterWork <= 3) screenScore = 6
  else if (inputs.screenHoursAfterWork <= 4) screenScore = 4
  else screenScore = 2

  const screenComment = screenScore >= 8 ? '合理用眼，屏幕没怎么偷电' :
    screenScore >= 6 ? '适度刷手机，少量电量流失' :
    screenScore >= 4 ? '沉迷屏幕，后台耗电严重' :
    '屏幕时间爆表，电量被偷光了'

  breakdown.push({
    category: 'screen',
    label: '屏幕耗电',
    score: screenScore,
    maxScore: 10,
    emoji: screenScore >= 8 ? '📱' : screenScore >= 4 ? '👀' : '🫠',
    comment: screenComment,
  })

  // 8. Financial stability (max 10)
  let financeScore = inputs.savings * 3 + 1
  financeScore = clamp(financeScore, 0, 10)

  const financeComment = financeScore >= 8 ? '财务稳定，没有经济焦虑偷电' :
    financeScore >= 5 ? '略有结余，经济压力可控' :
    financeScore >= 3 ? '月光族，钱包和电量一样空' :
    '负债累累，电量欠费已停机'

  breakdown.push({
    category: 'finance',
    label: '财务电量',
    score: financeScore,
    maxScore: 10,
    emoji: financeScore >= 8 ? '💰' : financeScore >= 3 ? '💸' : '🏚️',
    comment: financeComment,
  })

  // Age modifier (slight reduction for older ages, bonus for youth recovery)
  let ageMod = 0
  if (inputs.age < 25) ageMod = 3
  else if (inputs.age < 30) ageMod = 1
  else if (inputs.age < 35) ageMod = 0
  else if (inputs.age < 40) ageMod = -1
  else if (inputs.age < 50) ageMod = -2
  else ageMod = -3

  const totalRaw = breakdown.reduce((sum, b) => sum + b.score, 0) + ageMod
  const maxTotal = breakdown.reduce((sum, b) => sum + b.maxScore, 0)
  const totalBattery = clamp(Math.round((totalRaw / maxTotal) * 100), 0, 100)

  let level: BatteryResult['level']
  let title: string
  let description: string

  if (totalBattery >= 85) {
    level = 'excellent'
    title = '满电战神'
    description = '你的人生电量接近满格！继续保持这种状态，你就是行走的充电宝，给身边的人也充充电吧。'
  } else if (totalBattery >= 70) {
    level = 'good'
    title = '电量充沛'
    description = '生活状态不错，电量足够应对日常。注意那几个掉电快的区域，稍加调整就能满电复活。'
  } else if (totalBattery >= 50) {
    level = 'medium'
    title = '电量一般'
    description = '勉强够用，但随时可能进入低电量模式。是时候找找哪里在偷偷漏电了。'
  } else if (totalBattery >= 30) {
    level = 'low'
    title = '电量告急'
    description = '已经进入省电模式了！多个维度亮红灯，建议立刻找到充电桩，给自己好好充充电。'
  } else {
    level = 'critical'
    title = '即将关机'
    description = '电量严重不足，随时可能自动关机。请立刻停下来，给自己放个假，你值得被好好充电。'
  }

  return { totalBattery, breakdown, level, title, description }
}

export function getBatteryColor(level: BatteryResult['level']): string {
  switch (level) {
    case 'excellent': return '#22c55e'
    case 'good': return '#4ade80'
    case 'medium': return '#facc15'
    case 'low': return '#fb923c'
    case 'critical': return '#ef4444'
  }
}

export function getBatteryGradient(level: BatteryResult['level']): string {
  switch (level) {
    case 'excellent': return 'from-green-400 to-emerald-500'
    case 'good': return 'from-green-300 to-green-500'
    case 'medium': return 'from-yellow-300 to-amber-500'
    case 'low': return 'from-orange-400 to-red-500'
    case 'critical': return 'from-red-500 to-red-700'
  }
}
