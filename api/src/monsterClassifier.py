#!/usr/bin/python3
from fastai.vision.all import *
import torch
import PIL
import sys
import json

filename = '/Users/gurdevsihra/Projects/MonsterClassifier/api/potentialMonsters/' + sys.argv[1]

learn = load_learner('/Users/gurdevsihra/Projects/MonsterClassifier/api/src/model.pkl')

categories = ('Human','Monster')

def classify_image(img):
    pred,idx,probs = learn.predict(img)
    return dict(zip(categories,map(float,probs)))

im = PILImage.create(filename)
im.thumbnail((192,192))
im

res = classify_image(im)

print(res)

sys.stdout.flush()

