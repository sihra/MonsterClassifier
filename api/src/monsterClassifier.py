#!/usr/bin/python3
from fastai.vision.all import *
import torch
import PIL
import sys
import json

print(sys.argv)
filename = '/Users/gurdevsihra/Projects/MonsterClassifier/api/potentialMonsters/' + sys.argv[1]
print("Hello world again" + filename)

#print('Hello World')

#print('Hello mload learner')
learn = load_learner('/Users/gurdevsihra/Projects/MonsterClassifier/api/src/model.pkl')

categories = ('Human','Monster')

def classify_image(img):
    #print('Hello from classify image')
    pred,idx,probs = learn.predict(img)
    return dict(zip(categories,map(float,probs)))

im = PILImage.create(filename)
im.thumbnail((192,192))
im
#im = PIL.Image.new('gurdev.png',size=(200, 200))
#im.show()

res = classify_image(im)

print(res)

sys.stdout.flush()

