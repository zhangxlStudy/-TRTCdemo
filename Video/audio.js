import ASR from 'mul_speech_recogn'
import eventBus from '@/utils/eventBus'
//创建语音识别对象
export const makeAsr = (role) => {
  const obj = new ASR({
    secretKey: '',
    secretId: '',
    appId: ,
    // 实时识别接口参数
    engine_model_type: '16k_zh', // 引擎
    voice_format: 1,
    // 以下为非必填参数，可跟据业务自行修改
    hotword_id: '08003a00000000000000000000000000', //热词 id。用于调用对应的热词表，如果在调用语音识别服务时，不进行单独的热词 id 设置，自动生效默认热词；如果进行了单独的热词 id 设置，那么将生效单独设置的热词 id。
    needvad: 1, //0：关闭 vad，1：开启 vad。如果语音分片长度超过60秒，用户需开启 vad（人声检测切分功能）。
    filter_dirty: 1, //是否过滤脏词（目前支持中文普通话引擎）。默认为0。0：不过滤脏词；1：过滤脏词；2：将脏词替换为 * 。
    filter_modal: 1, //是否过语气词（目前支持中文普通话引擎）。默认为0。0：不过滤语气词；1：部分过滤；2：严格过滤 。
    filter_punc: 0, //	是否过滤句末的句号（目前支持中文普通话引擎）。默认为0。0：不过滤句末的句号；1：过滤句末的句号。
    convert_num_mode: 1, //是否进行阿拉伯数字智能转换（目前支持中文普通话引擎）。0：不转换，直接输出中文数字，1：根据场景智能转换为阿拉伯数字，3: 打开数学相关数字转换。默认值为1。
    word_info: 2, //是否显示词级别时间戳。0：不显示；1：显示，不包含标点时间戳，2：显示，包含标点时间戳。支持引擎 8k_en、8k_zh、8k_zh_finance、16k_zh、16k_en、16k_ca、16k_zh-TW、16k_ja、16k_wuu-SH，默认为0。
    audioTrack: role.getAudioTrack() //获取音轨
  })
  return obj
}

//语音识别的函数 可以根据自己的情况选择其中的某些函数  传递参数 来识别不同流的语音
export const speech = (meetPerson, name, index) => {
  meetPerson.start()
  // 开始识别
  meetPerson.OnRecognitionStart = (res) => {
    console.log('本地流：开始识别', res)
  }
  // 一句话开始
  meetPerson.OnSentenceBegin = (res) => {
    console.log('本地流：一句话开始', res)
  }
  // 识别变化时
  meetPerson.OnRecognitionResultChange = (res) => {
    console.log('本地流：识别变化时', res)
  }
  // 一句话结束
  meetPerson.OnSentenceEnd = (res) => {
    console.log('本地流：一句话结束', res)
  }
  // 识别有结果时
  meetPerson.OnChange = (res) => {
    console.log('本地流：识别中', res)
  }
  // 识别结束
  meetPerson.OnRecognitionComplete = (res) => {
    console.log('本地流：识别结束', res)
  }
  // 识别错误
  meetPerson.OnError = (res) => {
    console.log('本地流：识别失败', res)
  }
}