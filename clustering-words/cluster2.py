import numpy as np
import sklearn.cluster
import distance
import csv

#from:
#https://stats.stackexchange.com/questions/123060/clustering-a-long-list-of-strings-words-into-similarity-groups

words = "abort adorn alien alone angel april aural anime apple barge barre beach beans begin blame bland blend blink block bongo boris boxes brand brass bread brian brine build built bathe boats bored bunny beats bible bingo books black balls board birds brain blood cairn calls candy canva carry cells chevy chimp choir clash click color comma congo cough could crate crawl crazy crypt camel cable chair chart class clock count cakes chess couch court check cream cards daddy donut doors drain drape dread dream drill drive drops drugs drums dummy daisy death draws drink demon eagle early earth eaten enemy error euler eight faded fiber field fight final fires fists flame flash flies floor flour flunk forms forte found frank freak frost fangs farts flack frogs fails fines front frown fruit funny forks frame false gamer gamma gauge glare gourd grape grass grave grown guard guess guild games ghost goats gross great goals green glass handy haste haunt heads heard heavy hiker honey horse howdy human humor hurts hairs hands heart helps happy hello house ideas idiot image japan jerry jewel joust juice jumpy karma kills kilts kitty kiwis knows koala laser lever lived lives loath loser lower lunch large laugh learn leave lemon lucky light magic makes mambo mango means meats mecha metal mommy money moose milky minds mouth memes music mouse nails nicks north ounce ovals other paced pasta peace pesto piece pilot pines plain plank plays plead pluck polar press print proud punks puppy pussy pants photo point power pulse paint plate paste plant penis paper phone quark quart quick quilt quirk quite queen quest rainy raise ramps ranch react ready renew retro rhyme river roach rocks rogue ropes rosin rubix robot right saber santa scrum semen shant shape sheet shift shoes short shots sight silly skate skunk slain slice slime slope smash smell sneak space spent spoon stabs stair stamp stand steps stick still sting stope store strip stuck sucks super swept swole scifi spell spicy steep suite salsa savvy shelf shirt small speak stars steam stone shock start straw sunny slack smart seven table tango taped teams teeth tepid there thicc thumb tight times title towel track trick tries tripe trope truly trump truth turbo turns taste thank thing tired tough train trash truck trunk tiger torch trade trees treat think visit video watch whats which whore wings wiped witch women works would weird where write wrong world words water yeast yells yikes zebra tuple round major links total costs given curve"
words = words.split(" ")#"YOUR WORDS HERE".split(" ") #Replace this line
words = np.asarray(words) #So that indexing with a list will work
lev_similarity = -1*np.array([[distance.levenshtein(w1,w2) for w1 in words] for w2 in words])

affprop = sklearn.cluster.AffinityPropagation(affinity="precomputed", damping=0.5)
affprop.fit(lev_similarity)
for cluster_id in np.unique(affprop.labels_):
    exemplar = words[affprop.cluster_centers_indices_[cluster_id]]
    cluster = np.unique(words[np.nonzero(affprop.labels_==cluster_id)])
    cluster_str = ", ".join(cluster)
    print(" - *%s:* %s" % (exemplar, cluster_str))