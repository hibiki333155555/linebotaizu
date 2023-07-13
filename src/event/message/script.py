# 無視してください
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# Set device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = AutoModelForCausalLM.from_pretrained("cyberagent/open-calm-small").to(device)
tokenizer = AutoTokenizer.from_pretrained("cyberagent/open-calm-small")

inputs = tokenizer("今日疲れてしまいました", return_tensors="pt").to(device)
with torch.no_grad():
    tokens = model.generate(
        **inputs,
        max_length=64,
        do_sample=True,
        temperature=0.7,
        pad_token_id=tokenizer.pad_token_id,
    )

output = tokenizer.decode(tokens[0], skip_special_tokens=True)
print(output)

"""
def funllm(): 
    inputs = tokenizer("今日疲れてしまいました", return_tensors="pt").to(device)
    with torch.no_grad():
        tokens = model.generate(
            **inputs,
            max_length=64,
            do_sample=True,
            temperature=0.7,
            pad_token_id=tokenizer.pad_token_id,
        )

    output = tokenizer.decode(tokens[0], skip_special_tokens=True)
    print(output)



if __name__ == "__main__":
    funllm()


import sys
data = sys.stdin.readline()  #標準入力からデータを取得する
num=int(data)

def sum(a):
    return a+3

print(sum(num)) #print()の内容がjsに引き渡される。
"""