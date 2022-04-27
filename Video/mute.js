import { reactive, ref } from 'vue'
export const speeckList = reactive({
  mediator: true,
  applicant: true,
  respondent: true
})
// 静音本地流
export const muteMed = (meetPerson) => {
  if (speeckList.mediator) {
    meetPerson.mediator.video.muteAudio()
  } else {
    meetPerson.mediator.video.unmuteAudio()
  }
  speeckList.mediator = !speeckList.mediator
}

// 静音远端流1
export const muteApp = (meetPerson) => {
  if (speeckList.applicant) {
    meetPerson.applicant.video.muteAudio()
  } else {
    meetPerson.applicant.video.unmuteAudio()
  }
  speeckList.applicant = !speeckList.applicant
}

// 静音远端流2
export const muteRes = (meetPerson) => {
  if (speeckList.respondent) {
    meetPerson.respondent.video.muteAudio()
  } else {
    meetPerson.respondent.video.unmuteAudio()
  }
  speeckList.respondent = !speeckList.respondent
}
