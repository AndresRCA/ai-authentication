import fire
from ML_Estructure import ML_TRAINING
from ML_Estructure_Testing import ML_IMAGES,ML_TESTING_MAIN

"""
Arg:
if MODE=="TESTING":
    ML_TESTING_MAIN(PATH,iterate,SAVE)
elif MODE=="TRAINING":
    ML_TRAINING(PATH,iterate)
elif MODE=="IMAGE":
    ML_IMAGES(PATH)
elif MODE=="Fine_Tunning":
    ML_TRAINING(PATH,iterate,True)

"""

function_list={"TESTING":ML_TESTING_MAIN,"TRAINING":ML_TRAINING,"IMAGE":ML_IMAGES,"Fine_Tunning":ML_TRAINING}

def ML_function(PATH,MODE,iterate,finetunning,SAVE=None):
    f=function_list[MODE]
    f(PATH,iterate,finetunning,SAVE=None)

if __name__ == '__main__':
    fire.Fire(ML_function)