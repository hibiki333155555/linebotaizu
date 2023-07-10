import { hasKey } from '../../haskey.js';
import { PSDATA } from '../postback.js';
//import { messageMap } from './text-map.js';

export let TASKDATA = ['A社面接 7/22 13時', 'B社面接 7/23 13時', 'C社面接 7/24 13時',];
export let taskc = [];
export let tasknum = 1;
export let addstring = '';
export let delkey = 1;
export let deltask = false;
export let addtask = [false, false, false];
export let taskstr = '';


// テキストメッセージの処理をする関数
export const textEvent = async (event, appContext) => {
  // ユーザーから送られてきたメッセージ
  TASKDATA = PSDATA;
  const receivedMessage = event.message.text;

  // 送られてきたメッセージに応じて返信するメッセージを取得してreturn
  if (hasKey(messageMap, receivedMessage)) {
    return messageMap[receivedMessage](event, appContext);
  }


  // データを削除する際 deltaskがtrueの際
  if (deltask === true) {
    deltask = false;

    // メッセージが数字の想定
    delkey = parseInt(receivedMessage, 10);
    // 削除できるTASKが存在しない場合
    if (delkey > TASKDATA.length) {
      return {
        type: 'text',
        text: `TASK${receivedMessage}は存在しません`,
      };
    }
    // 削除できるTASKがある場合
    TASKDATA.splice(delkey - 1, 1);

    return {
      type: 'text',
      text: `TASK${receivedMessage}を削除しました`,
    };
  }

  // データを追加する際 addtask[0]がtrueの場合
  if (addtask[0] === true) {
    addtask = [false, true, false];
    taskstr = receivedMessage;
    addstring += receivedMessage + ' ';
    console.log(addtask);
    return messageMap['日付入力']();
  }

  if (addtask[1] === true) {
    addtask = [false, false, true];
    addstring += receivedMessage + ' ';
    return messageMap['時間入力']();
  }

  if (addtask[2] === true) {
    addtask = [false, false, false];
    addstring += receivedMessage + '時';
    TASKDATA.push(addstring);

    /*
    tasknum = TASKDATA.length;
    const car = {
      "title": `TASK${tasknum}`,
      "text": `${addstring}`,
      "actions": [
        {
          "type": "postback",
          "label": "達成ボタン",
          "data": "action=buy&itemid=111",
        },
        {
          "type": "postback",
          "label": "Add to cart",
          "data": "action=add&itemid=111",
        },
      ],
    };
    taskc.push(car);
    */

    addstring = '';
    taskstr = ' ';
    return {
      type: 'text',
      text: `TASKの追加が完了しました。\nTASK一覧と入力するとTASKを確認できます`,
    };
  }
  // ↑ までがtask作成の工程

  // エラー
  return {
    type: 'text',
    text: 'そのメッセージには対応していません',
  };
};

// 受け取ったメッセージと返信するメッセージ(を返す関数)をマッピング
export const messageMap = {
  TASK追加: () => {
    addtask[0] = true;
    return {
      type: 'text',
      text: '作成するtaskを入力してください\n例: A社面接',
    };
  },
  日付入力: () => {
    return {
      type: 'text',
      text: `「 ${taskstr} 」 の日付あるいは締切日を入力してください\n    例: 7/18`,
    };
  },
  時間入力: () => {
    return {
      type: 'text',
      text: `「 ${taskstr} 」 の開始あるいは締め切り時刻を数字[1~24]で入力してください\n    例: 13`,
    };
  },
  TASK一覧: () => {
    console.log(TASKDATA);
    let taskList = ["❤️---TASKS---❤️"];
    let i = 1;
    TASKDATA.forEach(elm => {
      taskList.push(i);
      i += 1;
      taskList.push(elm);
    })
    return {
      type: 'text',
      text: `${taskList.join('\n')}`,
    };
  },
  TASK削除: () => {
    deltask = true;
    return {
      type: 'text',
      text: '削除するTASKの番号を指定してください',
    };
  },
  こんにちは: () => ({
    type: 'text',
    text: 'まだ耐えて',
  }),
  TASKカルーセル: () => {
    let taskc = [];
    for (let i = 0; i < TASKDATA.length; i++) {
      const car = {
        "title": `TASK${i + 1}`,
        "text": `${TASKDATA[i]}`,
        "actions": [
          {
            "type": "postback",
            "label": "達成ボタン",
            "data": `action=達成&itemid=${i + 1}`,
          },
        ],
      };
      taskc.push(car);
    }

    return {
      "type": "template",
      "altText": "this is a carousel template",
      "template": {
        "type": "carousel",
        "columns": taskc,
        "imageAspectRatio": "rectangle",
        "imageSize": "cover"
      }
    }
  }
};

/*
{
  "thumbnailImageUrl": "https://example.com/bot/images/item1.jpg",
  "imageBackgroundColor": "#FFFFFF",
  "title": "this is menu",
  "text": "description",
  "defaultAction": {
    "type": "uri",
    "label": "View detail",
    "uri": "http://example.com/page/123"
  },
  "actions": [
    {
      "type": "postback",
      "label": "Buy",
      "data": "action=buy&itemid=111"
    },
    {
      "type": "postback",
      "label": "Add to cart",
      "data": "action=add&itemid=111"
    },
    {
      "type": "uri",
      "label": "View detail",
      "uri": "http://example.com/page/111"
    }
  ]
},
*/