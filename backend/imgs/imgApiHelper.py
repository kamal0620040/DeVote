from __future__ import print_function, unicode_literals
from facepplib import FacePP
import base64
import requests
import json

   
# define global variables
face_detection = ""
faceset_initialize = ""
face_search = ""
face_landmarks = ""
dense_facial_landmarks = ""
face_attributes = ""
beauty_score_and_emotion_recognition = ""
face_comparing_localphoto = ""
face_comparing_websitephoto = ""
   
# define face comparing function
def face_comparing(app, Image1, Image2):
      

  
   
    cmp_ = app.compare.get(image_url1 = Image1,
                           image_url2 = Image2)
   
   
    # Comparing Photos
    if cmp_.confidence > 70:
        return True
    else:
        return False
  
          
# Driver Code 

# api details
def driver(img1, img2):
    api_key ='xQLsTmMyqp1L2MIt7M3l0h-cQiy0Dwhl'
    api_secret ='TyBSGw8NBEP9Tbhv_JbQM18mIlorY6-D'

    
        
    # call api
    app_ = FacePP(api_key = api_key, 
                    api_secret = api_secret)
    funcs = [
        face_detection,
        face_comparing_localphoto,
        face_comparing_websitephoto,
        faceset_initialize,
        face_search,
        face_landmarks,
        dense_facial_landmarks,
        face_attributes,
        beauty_score_and_emotion_recognition
    ]
        

    try:
        url = 'https://api.imgbb.com/1/upload'
        key = '232565fc1a4f0d24578d9aeadc0b43ab'
        payload = {
            "key": key,
            "image": img1,
        }
        res = requests.post(url, payload)
        print(res.text)
        response=json.loads(res.text)
        attribute_value = response["data"]["display_url"]

        message= face_comparing(app_, attribute_value, img2)
    except:
        message="Error..."
    return message


