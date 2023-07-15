import { hasKey } from '../../haskey.js';
import { PSDATA } from '../postback.js';
import { itijikanmae, ohayo, osyaberiGPT } from './tuuti.js';
//import { messageMap } from './text-map.js';

export let TASKDATA = ['A社面接 7/10 22時', 'B社面接 7/10 23時', 'C社面接 7/24 24時',];
export let taskc = [];
export let tasknum = 1;
export let addstring = '';
export let delkey = 1;
export let deltask = false;
export let addtask = [false, false, false];
export let taskstr = '';
let tuutiflag = false;
var refreshIntervalId;
let isgpt = false;
let tuutisettei = [false, false];
let nanjikanmae = 1;


const formattedDateTime = (date) => {
  const m = ('0' + (date.getMonth() + 1)).slice(-2);
  const d = ('0' + date.getDate()).slice(-2);
  const h = ('0' + date.getHours()).slice(-2);
  return m + d + h;
};


// 定期通知の関数
function tuuti(nanjikanmae) {

  // 現在時刻を取得 例: 071022
  const date = new Date();
  const currentTime = formattedDateTime(date);
  console.log(currentTime);

  const regex = /.* (\d+)\/(\d+) (\d+)/;
  for (let i = 0; i < TASKDATA.length; i++) {
    const result = TASKDATA[i].match(regex);
    for (let j = 1; j < 4; j++) {
      if (result[j].length === 1) result[j] = '0' + result[j];
    }
    const love = result[1] + result[2] + result[3];
    //console.log(result);
    //console.log(love);
    //console.log(parseInt(love.substring(1, 6)));

    if ((love.substring(0, 5) === currentTime.substring(0, 5)) && (parseInt(love.substring(1, 6)) <= parseInt(currentTime.substring(1, 6)) + nanjikanmae)) {
      itijikanmae(result[0]);
    }
    console.log(currentTime.substring(4, 6));
  }

  if (currentTime.substring(4, 6) === '08') {
    let m = [];
    for (let i = 0; i < TASKDATA.length; i++) {
      const result = TASKDATA[i].match(regex);
      for (let j = 1; j < 4; j++) {
        if (result[j].length === 1) result[j] = '0' + result[j];
      }
      const love = result[1] + result[2] + result[3];

      if ((love.substring(0, 5) === currentTime.substring(0, 5)) && (parseInt(love.substring(1, 6)) === parseInt(currentTime.substring(1, 6)) + 1)) {
        itijikanmae(result[0]);
      }
      console.log(currentTime.substring(4, 6));
    }
    ohayo();
  }
};

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



    addstring = '';
    taskstr = ' ';
    return {
      type: 'text',
      text: `TASKの追加が完了しました。\nTASK一覧と入力するとTASKを確認できます`,
    };
  }
  // ↑ までがtask作成の工程


  if (tuutisettei[0] = true) {
    tuutisettei = [false, true];
    nanjikanmae = parseInt(receivedMessage);
    return {
      type: 'text',
      text: '通知開始から何分ごとに通知するか数字[10~240]で入力してください。\n  例: 30',
    };
  }

  if (tuutisettei[1] = true) {
    tuutisettei = [false, false];
    refreshIntervalId = setInterval(tuuti(nanjikanmae), parseInt(receivedMessage) * 60 * 1000);
    return {
      type: 'text',
      text: `通知設定が完了しました。`,
    };
  }

  // エラー

  if (isgpt) {
    const hento = await osyaberiGPT(receivedMessage);
    console.log(hento);
    return {
      type: 'text',
      text: `${hento}`,
    };
  } else {
    return {
      type: 'text',
      text: 'そのメッセージには対応していません',
    };
  }
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
  生TASK: () => {
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
  定期通知: () => {
    if (!tuutiflag) {
      tuutiflag = true;
      tuutisettei[0] = true;
      return {
        type: 'text',
        text: 'TASK予定時刻の何時間前から通知を開始するか数字[1~12]で入力してください。\n  例: 2 ',
      };
    }
    else {
      tuutiflag = false;
      clearInterval(refreshIntervalId);
      return {
        type: 'text',
        text: '通知をオフにしました',
      };
    }
  },
  TASK削除: () => {
    deltask = true;
    return {
      type: 'text',
      text: '削除するTASKの番号を指定してください',
    };
  },
  TASK保存: () => {
    const serializedArray = JSON.stringify(TASKDATA);
    localStorage.setItem('myArray', serializedArray);
    return {
      type: 'text',
      text: 'TASKの保存が完了しました',
    };
  },
  こんにちは: () => ({
    type: 'text',
    text: 'まだ耐えて',
  }),
  現在時刻: () => {
    const date = new Date();
    const currentTime = formattedDateTime(date);
    console.log(currentTime);
    return {
      type: 'text',
      text: `${currentTime}`,
    };
  },
  TASK一覧: () => {
    let taskc = [];
    for (let i = 0; i < TASKDATA.length; i++) {
      const car = {
        "title": `${TASKDATA[i]}`,
        "text": `TASK${i + 1}`,
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
  },
  test: () => {
    const date = new Date();
    const currentTime = formattedDateTime(date);
    console.log(currentTime);

    const mdhOfTask = [];
    // const regex = /.* (1[0-2])|([1-9])\/([1-9]|[1-2][0-9]|3[0-1]) (0[1-9]|1[0-9]|2[0-4])/
    const regex = /.* (\d+)\/(\d+) (\d+)/;
    for (let i = 0; i < TASKDATA.length; i++) {
      //mdhOfTask.push(TASKDATA[i].match(regex)[0]);
      //console.log(TASKDATA[i].match(regex)[0]);
      const result = TASKDATA[i].match(regex);
      for (let j = 1; j < 4; j++) {
        if (result[j].length === 1) result[j] = '0' + result[j];
      }
      console.log(result[1] + result[2] + result[3]);
    }
    //console.log(mdhOfTask);
  },
  何時: () => {
    const date = new Date();
    return {
      type: 'text',
      text: `${('0' + date.getHours()).slice(-2)}時だよ`
    };
  },
  テスト: () => {

    console.log('ok1');
    /*
    PythonShell.run('./src/event/message/script.py', null, function (err, data) {
      if (err) throw err;
      console.log(data);
      console.log('ok2');
    });
    */
    var pyshell = new PythonShell('./src/event/message/script.py');
    //pyshell.send(5);

    pyshell.on('message', function (data) {
      console.log(data);
    });

    console.log('ok3');
  },
  gpt: () => {
    if (isgpt) {
      isgpt = false;
      return {
        type: 'text',
        text: 'gptモードをオフにしました',
      };
    } else {
      isgpt = true;
      return {
        type: 'text',
        text: 'gptモードをオンにしました',
      };
    }
  },
  機能説明: () => {
    return {
      type: 'text',
      text: '―――――――――――――――――――\n始めまして\！友達追加ありがとうございます♪\n―――――――――――――――――――\n・当LINEbotではTASK管理ができます\n\n・「TASK追加」と送って、順に予定・日付・時間を順に入力することで、linebotに予定を記録することができます\n\n・「TASK一覧」と送ることで、TASKをボタン形式で表示することができ、達成ボタンを押すことでTASKを削除できます\n\n・「定期通知」と送るとTASK終了一時間前から定期的に通知します\n―――――――――――――――――――\nよきLINEbotライフを!\n―――――――――――――――――――',
    };
  },
};

