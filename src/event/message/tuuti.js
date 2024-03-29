import fetch from 'node-fetch';

const formattedDateTime = (date) => {
    // const y = date.getFullYear();
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);
    const h = ('0' + date.getHours()).slice(-2);
    // const mi = ('0' + date.getMinutes()).slice(-2);
    // const s = ('0' + date.getSeconds()).slice(-2);
    return m + d + h;
}

export const itijikanmae = (data, user) => {
    fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer jFy6khw6TMJ3IU+ifvaF5PAV3XFiQsrxoksTCpKUClQV47mrYrdLA9r95Mu3PpJhmx1kHkhIMYbBDUaiIcV/2kZKhRvCfBb++EwzzQeTVazjZyLBpanFDe7dJWo/6I50lXHf5DGyfIjat8b5uqPetAdB04t89/1O/w1cDnyilFU='
        },
        // body: '{\n  "to": "Uc3c1eddca9416f1cfd3188f68f638f15",\n  "messages": [\n    {\n      "type": "text",\n      "text": "Hello, user from api direct call!"\n    }\n  ]\n}',
        body: JSON.stringify({
            'to': `${user}`,
            'messages': [
                {
                    'type': 'text',
                    'text': `${data}が一時間後です!!`
                }
            ]
        })
    });
};

export const ohayo = (data, user) => {
    let m = "おはよう!"
    if (data.length > 1) m = `おはよう!今日の予定だよ!\n ${data.join('\n')}`;
    fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer jFy6khw6TMJ3IU+ifvaF5PAV3XFiQsrxoksTCpKUClQV47mrYrdLA9r95Mu3PpJhmx1kHkhIMYbBDUaiIcV/2kZKhRvCfBb++EwzzQeTVazjZyLBpanFDe7dJWo/6I50lXHf5DGyfIjat8b5uqPetAdB04t89/1O/w1cDnyilFU='
        },
        // body: '{\n  "to": "Uc3c1eddca9416f1cfd3188f68f638f15",\n  "messages": [\n    {\n      "type": "text",\n      "text": "Hello, user from api direct call!"\n    }\n  ]\n}',
        body: JSON.stringify({
            'to': `${user}`,
            'messages': [
                {
                    'type': 'text',
                    'text': `${m}`
                }
            ]
        })
    });
};

export const osyaberiGPT = async (data) => {

    // console.log('ここだね1');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '
        },
        body: JSON.stringify({
            'model': 'gpt-3.5-turbo',
            'messages': [
                {
                    'role': 'user',
                    'content': `次のメッセージに20文字以内で答えて\n${data}`,
                }
            ],
            'temperature': 0.7,
        })
    });

    // console.log('ここだね2');
    const osya = await response.json();
    console.log(osya);
    console.log(osya.choices[0].message.content);


    return await osya.choices[0].message.content;
}

export const osyaberikanojo = async (data) => {

    // console.log('ここだね1');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '
        },
        body: JSON.stringify({
            'model': 'gpt-3.5-turbo',
            'messages': [
                {
                    'role': 'user',
                    'content': `次のメッセージに20文字以内で答えて\n${data}`,
                }
            ],
            'temperature': 0.7,
        })
    });

    // console.log('ここだね2');
    const osya = await response.json();
    console.log(osya);
    console.log(osya.choices[0].message.content);


    return await osya.choices[0].message.content;
}