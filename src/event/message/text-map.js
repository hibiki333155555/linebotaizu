export const messageMap = {
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
    text: 'まだ耐えて',
  }),
};