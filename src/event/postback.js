import { TASKDATA, taskc, tasknum, addstring, deltask, addtask, taskstr, textEvent } from './message/text.js'
export let PSDATA = ['A社面接 7/10 22時', 'B社面接 7/10 23時', 'C社面接 7/24 13時',];

// ポストバックイベントが飛んできた時
export const postbackHandler = (event) => {
  let message;
  let PSDATA = TASKDATA;
  // ポストバックデータをpostbackDataに格納
  const postbackData = event.postback.data;
  // もしevent.postback.paramsが存在する場合
  if (postbackData === postbackData.match(/action=達成&itemid=([1-9]\d*|0)$/g)[0]) {
    let delkey = postbackData.replace(/[^0-9]/g, '');
    console.log(PSDATA);
    PSDATA.splice(delkey - 1, 1);
    return {
      type: 'text',
      text: `TASK${delkey}を達成しました!!!おめでとう🥳`,
    }
  }
  if (event.postback.params) {
    // 返信するメッセージを作成
    message = {
      type: 'text',
      text: `日時データを受け取りました！\ndata: ${postbackData}\ndatetime: ${event.postback.params.datetime}`,
    };
    // 存在しない場合
  } else {
    // 返信するメッセージを作成
    message = {
      type: 'text',
      text: `ポストバックデータを受け取りました！\ndata: ${postbackData}`,
    };
  }
  // 関数の呼び出し元（bot.jsのindex）に返信するメッセージを返す
  return message;
};
