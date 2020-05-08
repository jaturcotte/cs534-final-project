##########################################################################
# Imports
##########################################################################
import csv
import sys
import random
import numpy as np
import matplotlib.pyplot as plt
import time

#########################################################################
# Basic EM Stuff
#########################################################################

def EM(numClusters, points):
    #based on the video we had to watch for class:
    #https://www.youtube.com/watch?v=QQJHsKfNqG8&list=PLAwxTw4SYaPmaHhu-Lz3mhLSj-YH-JnG7&index=53
    

    #Perform EM
    bestLL = 0
    bestCenters = []
    if numClusters == 0:
        numClusters = BIC(points)
    startTime = time.time()
    curTime = time.time()
    print("starting em...")
    while(curTime < startTime + 120):
        centers, clusterGuess, LL = EMIteration(points, numClusters)

        if LL > bestLL:
            bestLL = LL
            bestCenters = centers

        curTime = time.time()
        
    #print the calculated centerss
    print("The centers are: " + str(centers))
    print("The log likelihood is: " + str(LL))

    #plotPoints = points.copy()
    #plot(plotPoints, clusterGuess, numClusters, centers)


#Does one iteration of EM
def EMIteration(points, numClusters):
    #choose random starting centers from the list of points
    centers = np.empty(numClusters, dtype=object)
    shuffledPoints = points.copy()
    plotPoints = points.copy()
    random.shuffle(shuffledPoints)
    for i in range(numClusters):
        centers[i] = shuffledPoints.pop()
    clusterGuess = np.empty(len(points), dtype=object)
    for index in range(len(clusterGuess)):
        clusterGuess[index] = (0,0)
    #Perform EM
    startTime = time.time()
    curTime = startTime
    for i in range(10):
        #get the current variances
        variances = np.empty(numClusters)
        for centerIndex in range(len(centers)):
            variances[centerIndex] = variance(points, centers[centerIndex])

        #expectation
        for counter in range(len(points)):
            #don't recalculate points we're really sure about
            if clusterGuess[counter][1] > 0.99:
                continue
            point = points[counter]
            bestGuess = (0, 0)
            total = 0.0
            for cIndex in range(len(centers)):
                total += probablity(point, centers[cIndex], variances[cIndex])
            for centerIndex in range(len(centers)):
                testCenter = expectation(points, centers, point, centers[centerIndex], variances[centerIndex], total) 
                if testCenter > bestGuess[1]:
                    bestGuess = (centerIndex, testCenter)
            clusterGuess[counter] = bestGuess
        
        #maximization
        for count in range(len(centers)):
            tempPoints = []
            for index in range(len(clusterGuess)):
                if clusterGuess[index][0] == count and clusterGuess[index][1] >= 0.6:
                    tempPoints.append(points[index])
            centers[count] = maximization(tempPoints, centers, centers[count], variances[count])
        
    logLikelihood = calculateLogLikelihood(points, centers, variances)

    #get the logLikelihood
    variances = centers.copy()
    for centerIndex in range(len(centers)):
        variances[centerIndex] = variance(points, centers[centerIndex])
    logLikelihood = calculateLogLikelihood(points, centers, variances)

    return centers, clusterGuess, logLikelihood


#does the probability calculation
def probablity(x, mu, sigma):
    d = distance(x, mu)
    if d == 0:
        return np.exp(-0.5 * np.log(np.power(sigma, 2)) * np.log((np.power((10**-10), 2))))
    else:
        return np.exp(-0.5 * np.log(np.power(sigma, 2)) * np.log(d))

#calculates the variance
def variance(points, mu):
    s2 = 0
    for x in points:
        s2 += distance(x, mu)
    return s2 / (len(points))

#calculates the square of the distance between two points
def distance(p1, p2):
    dist = 0
    for index in range(len(p1)):
        dist += np.power((ord(p1[index])-ord(p2[index])), 2)
    return dist

#calculate the value of a word
#converts each char to ascii and sums
def wordValue(word):
    value = 0
    for i in range(len(word)):
        value += ord(word[i])
    return value

# calculates the expectation
# points are the x values
# centers is the different means
# i and j are point and the center
def expectation(points, centers, i, j, v, total):
    p = probablity(i, j, v)
    return p/total

# does the maximization
def maximization(points, centers, j, variance):
    if len(points) == 0:
        return "abcde"
    sum = np.zeros(len(points[0]))
    denom = 0
    for x in points:
        total = 0.0
        for c in centers:
            total += probablity(x, c, variance)
        for count in range(len(sum)):
            sum[count] += expectation(points, centers, x, j, variance, total) * ord(x[count])
        denom += expectation(points, centers, x, j, variance, total)
    average = ""
    for i in range(5):
        average += chr(int(sum[count]/denom))
    return average


#open points
def readCSVPoints():
    words = []

    #read from csv
    with open("wordsandcounts.csv") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        #adds the words to the list count number of times
        for row in csv_reader:
            count = int(row[1])
            for i in range(count):
                words.append(row[0])
    #print(words)
    return words

#calculates the log likelihood
#based on the spreadsheet candy example
# LL = sum LL of each point
# LL of each point = data * Log(P(data))
### I'm not sure what the data means but I used the expectation as the data?
def calculateLogLikelihood(points, centers, v):
    LL = 0
    total = 0
    for point in points:
        for cIndex in range(len(centers)):
            total += probablity(point, centers[cIndex], v[cIndex])
        for c in range(len(centers)):
            LL += expectation(points, centers, point, centers[c], v[c], total) * probablity(point, centers[c], v[c])
    return LL

#########################################################################
# Calculate the number of points (BIC)
#########################################################################

#https://en.wikipedia.org/wiki/Bayesian_information_criterion
def BIC(points):
    print("Starting BIC...")
    numClusters = 1
    bestBIC = float('inf')
    n = len(points)
    strikes = 0

    for k in range(1, max(n // 10, min(n, 40))):
        L = EMIteration(points, k)[2]
        temp = calculateBIC(L, n, k)
        if temp < bestBIC:
            numClusters = k
            bestBIC = temp
            strikes = 0

    print("Completed BIC there are " + str(numClusters) + " clusters!")
    print("The BIC score is: " + str(bestBIC))
    return numClusters

#calculates BIC value as mentioned in the wikipedia article
def calculateBIC(L, n, k):
    # we don't take the natural log of L because it's already the log likelihood
    return np.log(n) * k - 2 * L


#########################################################################
# scatter plots the points and cluster centers
#########################################################################
def plot(points, cluster, numClusters, centers):
    x = []
    y = []
    colors = np.empty(len(points), dtype=tuple)
    clusterColors = [(random.random(), random.random(), random.random()) for i in range(numClusters)]
    for i in range(len(points)):
        x.append(points[i][0])
        y.append(points[i][1])
        if len(cluster) > 0:
            col = clusterColors[cluster[i][0]]
            alpha = max(0.3, min(1, (cluster[i][1] - 0.99) * 100))
        else:
            col = clusterColors[0]
            alpha = 1
        colors[i] = (col[0], col[1], col[2], alpha)
    plt.scatter(x, y, c=colors)

    fig = plt.gcf()
    ax = fig.gca()
    for i, c in enumerate(centers):
        # TODO radius of circle hard-coded, probably a better way to calculate
        col = [1 - c for c in clusterColors[i]]
        center_circle = plt.Circle((c[0], c[1]), 0.01, color="black")
        cluster_circle = plt.Circle((c[0], c[1]), 1, fill=False, edgecolor=col)
        ax.add_artist(center_circle)
        ax.add_artist(cluster_circle)

    plt.show()

#########################################################################
# Main method and command line stuff
#########################################################################
if __name__ == "__main__":
    points = readCSVPoints()
    EM(int(sys.argv[1]), points)
