import { hasKey } from '../../haskey.js';
// import { messageMap } from './text-map.js';

let ToDoData = [
  "破壊 7/16 5時",
  "破壊 7/17 13時",
  "破壊 7/18 17時",
  "破壊 7/19 22時"
];

let delkey = 1;

// テキストメッセージの処理をする関数
export const textEvent = async (event, appContext) => {
  // ユーザーから送られてきたメッセージ
  const receivedMessage = event.message.text;

  // 送られてきたメッセージに応じて返信するメッセージを取得してreturn
  if (hasKey(messageMap, receivedMessage)) {
    return messageMap[receivedMessage](event, appContext);
  }
  else {
    // データを削除する際 (メッセージが一文字の場合)
    if (event.message.text.length === 1) {
      delkey = parseInt(receivedMessage, 10);
      // 削除できるTASKが存在しない場合
      if (delkey > ToDoData.length) {
        return {
          type: 'text',
          text: `TASK${receivedMessage}は存在しません`,
        };
      }
      // 削除できるTASKがある場合
      if (delkey === 1) {
        ToDoData.shift();
      } else {
        ToDoData.splice(delkey - 1, 1);
      }
      return {
        type: 'text',
        text: `TASK${receivedMessage}を削除しました`,
      };
    }
    console.log(ToDoData);
    ToDoData.push(receivedMessage);
  }

  // 返信するメッセージが存在しない場合
  return {
    type: 'text',
    text: `${receivedMessage}\nを追加しました`,
  };
};

const delTask = (delkey) => {

}

// ユーザーのプロフィールを取得する関数
const getUserProfile = (event, client) => client.getProfile(event.source.userId);

// 受け取ったメッセージと返信するメッセージ(を返す関数)をマッピング
const messageMap = {
  AddToDo: () => ({
    type: 'template',
    altText: 'this is a confirm template',
    template: {
      type: 'confirm',
      text: '以下から選択してください',
      actions: [
        {
          type: 'message',
          label: 'ToDo作成',
          text: 'todo作成'
        },
        {
          type: 'message',
          label: 'ToDo一覧',
          text: 'todo一覧'
        }
      ]
    }
  }),
  ToDo作成: () => {
    return {
      type: 'text',
      text: '作成するToDoを入力してください'
    };
  },
  ToDo一覧: () => {
    console.log(ToDoData);
    let todoList = ["❤️---TASKS---❤️"];
    let i = 1;
    ToDoData.forEach(elm => {
      todoList.push(i);
      i = i + 1;
      todoList.push(elm);
    })
    return {
      type: 'text',
      text: `${todoList.join('\n')}`,
    };
  },
  ToDo削除: () => {
    return {
      type: 'text',
      text: '削除するTASKの番号を指定してください',
    };
  },
  こんにちは: () => ({
    type: 'text',
    text: 'Hello, world',
  }),
  複数メッセージ: () => ([
    {
      type: 'text',
      text: 'Hello, user',
    },
    {
      type: 'text',
      text: 'May I help you?',
    },
  ]),
  プロフィール: async (event, appContext) => {
    // ユーザーのプロフィール情報を取得
    const profile = await getUserProfile(event, appContext.lineClient);
    // 返信するメッセージを作成
    return {
      type: 'text',
      text: `あなたの名前: ${profile.displayName}\nユーザーID: ${profile.userId}\nプロフィール画像のURL: ${profile.pictureUrl}\nステータスメッセージ: ${profile.statusMessage}`,
    };
  },
  ここはどこ: (event) => ({
    type: 'text',
    text: `ここは${event.source.type}だよ！`,
  }),
};

