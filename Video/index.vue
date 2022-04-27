<template>
  <div class="video el-tabs--border-card">
    <div class="video-box">
      <!-- 本地流 -->
      <div id="mediator" :class="openID === 1 ? 'video-selected' : 'video-normal'" :style="openID === 1 ? 'left:0' : ''" class="vider-local">
        <div class="video-title">本地流</div>
        <div class="vidoe-icon">
          <SvgIcon :name="speeckList.mediator ? 'unmute' : 'mute'" color="black" size="30" class-name="item-icon" @click="muteMed(meetPerson)" />
          <SvgIcon :name="openID === 1 ? 'suoxiao' : 'fangda'" color="black" size="30" class-name="item-icon" @click="enlarge(1)" />
        </div>
      </div>
      <!-- 远端流1 -->
      <div id="applicant" :class="openID === 2 ? 'video-selected' : 'video-normal'" class="vider-app">
        <div class="video-title">远端流1</div>
        <div class="vidoe-icon">
          <SvgIcon :name="speeckList.applicant ? 'unmute' : 'mute'" color="black" size="30" class-name="item-icon" @click="muteApp(meetPerson)" />
          <SvgIcon :name="openID === 2 ? 'suoxiao' : 'fangda'" color="black" size="30" class-name="item-icon" @click="enlarge(2)" />
        </div>
      </div>
      <!-- 远端流2 -->
      <div id="respondent" :class="openID === 3 ? 'video-selected' : 'video-normal'" class="vider-res">
        <div class="video-title">远端流2</div>
        <div class="vidoe-icon">
          <SvgIcon :name="speeckList.respondent ? 'unmute' : 'mute'" color="black" size="30" class-name="item-icon" @click="muteRes(meetPerson)" />
          <SvgIcon :name="openID === 3 ? 'suoxiao' : 'fangda'" color="black" size="30" class-name="item-icon" @click="enlarge(3)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onUnmounted } from 'vue'
import { openID, enlarge } from './enlarge'
import { speeckList, muteMed, muteApp, muteRes } from './mute'
import { meetPerson, initClient, initLocalStream, addFar } from './video'
const medStore = mediation()
// 腾讯信息
const state = reactive({
  userSig: '',
  applicant: '',
  mediator: '',
  respondent: '',
  roomId: '',
  SDKAPPID: ''
})
// 获取房间信息
const midInfo = async () => {
  const { user_sig, applicant_id, mediator_id, respondent_id, room_id, sdkappid } = await mediationInfo({ case_id: state.caseId, user_type: 3 })
  state.userSig = user_sig
  state.applicant = applicant_id
  state.mediator = mediator_id
  state.respondent = respondent_id
  state.roomId = room_id
  state.SDKAPPID = sdkappid
}

//进入音视频通话房间，进入房间这个时间比较长，进入房间成功之后再创建本地流并且订阅远端流
const joinRoom = async () => {
  await midInfo()
  initClient(state)
  meetPerson.client
    .join({ roomId: state.roomId })
    .then((res) => {
      console.log('进入房间成功' + res)
      initLocalStream(state)
      addFar(state)
    })
    .catch((error) => {
      console.error('进入房间失败' + error)
    })
}
// 退房
const leaveRoom = async () => {
  meetPerson.mediator.video && meetPerson.mediator.video.stop()
  meetPerson.mediator.video && meetPerson.mediator.video.close()
  meetPerson.mediator.video = null
  meetPerson.client.off('*')
  meetPerson.client.unpublish(meetPerson.mediator.video)
  meetPerson.mediator.audio.stop()
  meetPerson.client
    .leave()
    .then(() => {
      // 退房成功，可再次调用client.join重新进房开启新的通话。
    })
    .catch((error) => {
      console.error('退房失败 ' + error)
      // 错误不可恢复，需要刷新页面。
    })
}

onUnmounted(() => {
  try {
    leaveRoom()
  } catch (error) {
    return false
  }
})

//joinRoom()
</script>

<style scoped lang="less">
.video {
  padding: 10px;
  height: calc(60vh + 30px);
  .video-box {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .video-normal {
    width: calc((100% - 10px) / 2);
    height: calc((100% - 10px) / 2);
  }

  .video-selected {
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  .vider-local {
    background: gray;
    position: absolute;
    top: 0;
    left: 25%;
    transition: all 0.6s ease;
  }

  .vider-app {
    background: gray;
    position: absolute;
    bottom: 0;
    left: 0;
    transition: all 0.6s ease;
  }
  .vider-res {
    background: gray;
    position: absolute;
    bottom: 0;
    right: 0;
    transition: all 0.6s ease;
  }

  .video-title {
    position: absolute;
    top: 0;
    right: 0;
    color: white;
    font-size: 30px;
    padding: 10px 10px 0 0;
    z-index: 1;
  }

  .vidoe-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
    .item-icon {
      background: white;
      border-radius: 50%;
      padding: 10px;
      margin: 0 5px 5px 0;
    }
  }
}
</style>
