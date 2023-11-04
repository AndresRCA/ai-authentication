from ML_Resources import *
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_recall_curve, f1_score
from PIL import Image
import matplotlib.pyplot as plt
from matplotlib.table import Table

# Load the training dataset
folder_dataset = datasets.ImageFolder(root="*")

# Resize the images and transform to tensors
transformation = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize(mean = [0.485, 0.456, 0.406],std = [0.229, 0.224, 0.225])
    ]
)

transformation_test = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean = [0.485, 0.456, 0.406],std = [0.229, 0.224, 0.225])
    ]
)

siamese_dataset = SiameseNetworkDataset(
        imageFolderDataset=folder_dataset, transform=transformation
    )
    # Load the Testing dataset
testing_dataloader = DataLoader(
        siamese_dataset, shuffle=True, num_workers=8, batch_size=1
    )

def imshow(img, text=None):
    npimg = img.numpy()
    plt.axis("off")
    if text:
        plt.text(75, 8, text, style='italic',fontweight='bold',
            bbox={'facecolor':'white', 'alpha':0.8, 'pad':10})
        
    plt.imshow(np.transpose(npimg, (1, 2, 0)))
    plt.savefig('image_test_output.png')  


def im_report_save(experiment_name,mean_best_threshold,mean_max_f1):

    metrics_data = [["Model",'threshold', 'F1 Score'],
                [experiment_name, "{:.2f}".format(mean_best_threshold),"{:.2f}".format(mean_max_f1)]]
    
    fig, ax = plt.subplots(figsize=(6, 3))
    # Crear una tabla con los datos
    table = ax.table(cellText=metrics_data, loc='center', cellLoc='center', colLabels=None)
    table.auto_set_font_size(False)
    table.set_fontsize(12)
    table.scale(1, 1.5)
    # Ocultar ejes
    ax.axis('off')
    # Guardar la tabla como una imagen
    plt.savefig(experiment_name+".png", bbox_inches='tight', pad_inches=0, dpi=300)


def ML_TESTING_MAIN(PATH,MODE,iterate,Finetunning,SAVE=None):
    model = torch.load(PATH)
    Experiment_name=SAVE
    max_f1=np.array([])
    best_threshold=np.array([])

    for _ in range(int(iterate)):
        x,Y=ML_INFERENCE(model)
        f1_value,threshold_value=ML_SCORING(x,Y)
        max_f1=np.append(max_f1,f1_value)
        best_threshold=np.append(best_threshold,threshold_value)    
    mean_best_threshold=np.mean(best_threshold)
    mean_max_f1=np.mean(max_f1)
    print("Threshold de métrica:{:.2f} Con el Score de media {:.2f}".format(mean_best_threshold,mean_max_f1))
    print("Con una desviación Estandar de Threshold {:.2f} y F1 {:.2f} ".format(np.std(best_threshold),np.std(max_f1)))
    im_report_save(Experiment_name,mean_best_threshold,mean_max_f1)


def ML_INFERENCE(model):

    model.eval()
    X = []
    y = []
    # Realiza la inferencia en los datos de prueba utilizando el modelo.
    with torch.no_grad():
        for inputs in testing_dataloader:
            output1, output2 = model(inputs[0].to("cuda"), inputs[1].to("cuda"))
            euclidean_distance = F.pairwise_distance(output1, output2)
            X.append(euclidean_distance.item())
            y.append(inputs[2].tolist()[0][0])

    y = np.ravel(np.array(y).reshape(-1, 1))
    X = np.array(X).reshape(-1, 1)

    return y, X


def ML_SCORING(y, X):
    clf = LogisticRegression()
    clf.fit(X, y)

    # Obtener las probabilidades de clasificación
    probs = clf.predict_proba(X)[
        :, 1
    ]  # La segunda columna contiene las probabilidades de clase positiva

    # Calcular las métricas de precisión y recuperación en función de diferentes umbrales
    precisions, recalls, thresholds = precision_recall_curve(y, probs)

    # Calcular el F1-score en función de diferentes umbrales
    f1_scores = [
        2 * (p * r) / (p + r) if (p + r) > 0 else 0 for p, r in zip(precisions, recalls)
    ]

    max_f1 = max(f1_scores)

    # Encontrar el umbral que maximiza el F1-score
    best_threshold = thresholds[f1_scores.index(max_f1)]

    return (max_f1, best_threshold)

def ML_IMAGES(PATH,iterate,Finetunning,SAVE=None):
    model=torch.load(PATH)
    model.eval()
    image1_path = '*.jpg'
    image2_path = '*.PNG'
    image1_RGB = Image.open(image1_path).convert('RGB')
    image2_RGB = Image.open(image2_path).convert('RGB')

    trans = transforms.Compose([transforms.Resize((224, 224)),transforms.ToTensor()])
    image1_L=trans(image1_RGB).unsqueeze(0)
    image2_L=trans(image2_RGB).unsqueeze(0)

    image1 = transformation_test(image1_RGB).unsqueeze(0)  # Agregar una dimensión de lote (batch)
    image2 = transformation_test(image2_RGB).unsqueeze(0)


    output1, output2 = model(image1.cuda(), image2.cuda())
    euclidean_distance = F.pairwise_distance(output1, output2)

    concatenated = torch.cat((image1_L, image2_L), 0)
    imshow(torchvision.utils.make_grid(concatenated), f'Dissimilarity: {euclidean_distance.item():.2f}')

def ML_WEB_IMAGES(PATH,test_image_web,test_image):
    model=torch.load(PATH).eval()
    model.eval()
    image1 = transformation_test(test_image_web).unsqueeze(0)  # Agregar una dimensión de lote (batch)
    image2 = transformation_test(test_image).unsqueeze(0)
    euclidean_distance = F.pairwise_distance(image1, image2)
    return euclidean_distance


