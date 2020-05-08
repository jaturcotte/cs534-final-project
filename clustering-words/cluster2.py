import numpy as np
import sklearn.cluster
import distance
import csv

words = ""

#read from csv
with open("wordsandcounts.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    #adds the words to the list count number of times
    for row in csv_reader:
        count = int(row[1])
        for i in range(count):
            words += row[0]+" "



words = words.split(" ")#"YOUR WORDS HERE".split(" ") #Replace this line
words.pop() #remove the extra "" word at the end
words = np.asarray(words) #So that indexing with a list will work
lev_similarity = -1*np.array([[distance.levenshtein(w1,w2) for w1 in words] for w2 in words])

affprop = sklearn.cluster.AffinityPropagation(affinity="precomputed", damping=0.5)
affprop.fit(lev_similarity)
for cluster_id in np.unique(affprop.labels_):
    exemplar = words[affprop.cluster_centers_indices_[cluster_id]]
    cluster = np.unique(words[np.nonzero(affprop.labels_==cluster_id)])
    cluster_str = ", ".join(cluster)
    print(" - *%s:* %s" % (exemplar, cluster_str))