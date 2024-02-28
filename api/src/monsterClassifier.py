#!/usr/bin/python3
from fastai.vision.all import *
import torch
import PIL
import sys
import json
import os

learnerPath = os.path.dirname(__file__)
monsterPath = os.path.dirname(learnerPath)
filename = monsterPath + '/potentialMonsters/' + sys.argv[1]
learner = learnerPath + '/model.pkl' 

learn = load_learner(learner)

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

