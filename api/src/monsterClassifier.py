#!/usr/bin/python3
from fastai.vision.all import *
import torch
import PIL
print('Hello World')

def isMonster(x): return x[0].isupper()

print('Hello mload learner')
learn = load_learner('model.pkl')

categories = ('Human','Monster')
def classify_image(img):
    print('Hello from classify image')
    pred,idx,probs = learn.predict(img)
    return dict(zip(categories,map(float,probs)))

im = PILImage.create('gurdev.png')
im.thumbnail((192,192))
im
#im = PIL.Image.new('gurdev.png',size=(200, 200))
#im.show()

print(classify_image(im))

print('Hello from python')