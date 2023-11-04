from ML_Resources import *

# Load the training dataset
folder_dataset = datasets.ImageFolder(root="./data/faces/training/")

# Resize the images and transform to tensors
transformation = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize(mean = [0.485, 0.456, 0.406],std = [0.229, 0.224, 0.225])
    ]
)

# Initialize the network
siamese_dataset = SiameseNetworkDataset(
    imageFolderDataset=folder_dataset, transform=transformation
)
# Load the training dataset
train_dataloader = DataLoader(
    siamese_dataset, shuffle=True, num_workers=8, batch_size=30
)


def ML_TRAINING(PATH,MODE,iterate,finetunning,SAVE=None):

    if finetunning:
        net =torch.load(PATH)
    else:
        net = SiameseNetwork().cuda()
    criterion = ContrastiveLoss()
    optimizer = optim.Adam(net.parameters(), lr=0.0005)
    counter = []
    loss_history = []
    iteration_number = 0

    # Iterate throught the epochs
    for epoch in range(iterative):
        # Iterate over batches
        for i, (img0, img1, label) in enumerate(train_dataloader, 0):
            # Send the images and labels to CUDA
            img0, img1, label = img0.cuda(), img1.cuda(), label.cuda()

            # Zero the gradients
            optimizer.zero_grad()

            # Pass in the two images into the network and obtain two outputs
            output1, output2 = net(img0, img1)
            # Pass the outputs of the networks and label into the loss function
            loss_contrastive = criterion(output1, output2, label)

            # Calculate the backpropagation
            loss_contrastive.backward()

            # Optimize
            optimizer.step()

            # Every 10 batches print out the loss
            if i % 10 == 0:
                print(
                    f"Epoch number {epoch}\n Current loss {loss_contrastive.item()}\n"
                )
                iteration_number += 10

                counter.append(iteration_number)
                loss_history.append(loss_contrastive.item())

    torch.save(net, PATH)
