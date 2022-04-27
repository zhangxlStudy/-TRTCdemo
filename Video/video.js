import TRTC from 'trtc-js-sdk'
import { reactive } from 'vue'
import { makeAsr, speech } from './audio'

export const meetPerson = reactive({
  client: '', //客户端对象
  mediator: {
    video: '',
    audio: ''
  },
  applicant: {
    video: '',
    audio: ''
  },
  respondent: {
    video: '',
    audio: ''
  }
})

//判断浏览器是否支持
export const checkEnv = () => {
  TRTC.checkSystemRequirements().then((checkResult) => {
    if (!checkResult.result) {
      alert('当前浏览器不支持视频通话, 请更换其他浏览器')
    }
  })
}
// 实时通话模式下创建客户端对象
export const initClient = async (state) => {
  meetPerson.client = TRTC.createClient({
    sdkAppId: state.SDKAPPID,
    userId: state.mediator,
    userSig: state.userSig,
    mode: 'rtc'
  })
}
//创建本地音视频流并且初始化,初始化成功之后发布本地流
export const initLocalStream = async (state) => {
  meetPerson.mediator.video = TRTC.createStream({
    audio: true,
    video: true,
    userId: state.mediator
  })
  try {
    await meetPerson.mediator.video.initialize()
    meetPerson.mediator.audio = makeAsr(meetPerson.mediator.video) //创建本地角色语音识别
    await meetPerson.mediator.video.play('mediator')
    await meetPerson.client.publish(meetPerson.mediator.video)
    speech(meetPerson.mediator.audio, 3, 'mediator')
  } catch (err) {
    meetPerson.mediator.video = ''
    alert(`${JSON.stringify(err.message)}`)
  }
}
//进入房间后订阅远端流  如果远端流订阅成功，播放远端流
export const addFar = async (state) => {
  meetPerson.client.on('stream-added', (event) => {
    const remoteStream = event.stream
    //订阅远端流
    meetPerson.client.subscribe(remoteStream)
  })
  meetPerson.client.on('stream-subscribed', (event) => {
    if (event.stream.userId_ === state.applicant) {
      meetPerson.applicant.video = event.stream
      meetPerson.applicant.audio = makeAsr(event.stream)
      await meetPerson.applicant.video.play('applicant')
      speech(meetPerson.applicant.audio, 4, 'applicant')
    } else if (event.stream.userId_ === state.respondent) {
      meetPerson.respondent.video = event.stream
      meetPerson.respondent.audio = makeAsr(event.stream)
      await meetPerson.respondent.video.play('respondent')
      speech(meetPerson.respondent.audio, 5, 'respondent')
    }
  })
}
