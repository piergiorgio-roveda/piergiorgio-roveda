<!-- image -->

## Curse of dimensionality

The curse of dimensionality refers to various phenomena that arise when analyzing and organizing data in high-dimensional spaces that do not occur in low-dimensional settings such as the three-dimensional physical space of everyday experience. The expression was coined by Richard E. Bellman when considering problems in dynamic programming . [1][2] The curse generally refers to issues that arise when the number of datapoints is small (in a suitably defined sense) relative to the intrinsic dimension of the data.

Dimensionally cursed phenomena occur in domains such as numerical analysis , sampling , combinatorics , machine learning , data mining and databases . The common theme of these problems is that when the dimensionality increases, the volume of the space increases so fast that the available data become sparse. In order to obtain a reliable result, the amount of data needed often grows exponentially with the dimensionality . Also, organizing and searching data often relies on detecting areas where objects form groups with similar properties; in high dimensional data, however , all objects appear to be sparse and dissimilar in many ways, which prevents common data organization strategies from being efficient.

## Domains

## Combinatorics

In some problems, each variable can take one of several discrete values, or the range of possible values is divided to give a finite number of possibilities. Taking the variables together , a huge number of combinations of values must be considered. This effect is also known as the combinatorial explosion . Even in the simplest case of binary variables , the number of possible combinations already is , exponential in the dimensionality . Naively, y, each additional dimension doubles the effort needed to try all combinations.

## Sampling

There is an exponential increase in volume associated with adding extra dimensions to a mathematical space . For example, 10 2 = 100 evenly spaced sample points suffice to sample a unit interval (try to visualize a "1-dimensional" cube) with no more than 10 − 2 = 0.01 distance between points; an equivalent sampling of a 10-dimensional unit hypercube with a lattice that has a spacing of 10 − 2 = 0.01 between adjacent points would require 10 20 = [(10 2 ) 10 ] sample points. In general, with a spacing distance of 10 − n the 10-dimensional hypercube appears to be a factor of 10 n(10 − 1) = [(10 n ) 10 /(10 n )] "larger" than the 1dimensional hypercube, which is the unit interval. In the above example n = 2: when using a sampling distance of 0.01 the 10-dimensional hypercube appears to be 10 18 "larger" than the unit interval. This effect is a combination of the combinatorics problems above and the distance function problems explained below .

## Optimization

When solving dynamic optimization problems by numerical backward induction , the objective function must be computed for each combination of values. This is a significant obstacle when the dimension of the "state variable" is large. [3]

## Machine learning

In machine learning problems that involve learning a "state-of-nature" from a finite number of data samples in a high-dimensional feature space with each feature having a range of possible values, typically an enormous amount of training data is required to ensure that there are several samples with each combination of values. In an abstract sense, as the number of features or dimensions grows, the amount of data we need to generalize accurately grows exponentially . [4]

A typical rule of thumb is that there should be at least 5 training examples for each dimension in the representation. [5]
I n machine learning and insofar as predictive performance is concerned, the curse of dimensionality is used interchangeably with the peaking phenomenon , [5] which is also known as Hughes phenomenon . [6] This phenomenon states that with a fixed number of training samples, the average (expected) predictive power of a classifier or regressor first increases as the number of dimensions or features used is increased but beyond a certain dimensionality it starts deteriorating instead of improving steadily . [7][8][9]

Nevertheless, in the context of a simple classifier (e.g., linear discriminant analysis in the multivariate Gaussian model under the assumption of a common known covariance matrix), Zollanvari, et al. , showed both analytically and empirically that as long as the relative cumulative efficacy of an additional feature set (with respect to features that are already part of the classifier) is greater (or less) than the size of this additional feature set, the expected error of the classifier constructed using these additional features will be less (or greater) than the expected error of the classifier constructed without them. In other words, both the size of additional features and their (relative) cumulative discriminatory effect are important in observing a decrease or increase in the average predictive power . [10]

In metric learning , higher dimensions can sometimes allow a model to achieve better performance. After normalizing embeddings to the surface of a hypersphere, FaceNet achieves the best performance using 128 dimensions as opposed to 64, 256, or 512 dimensions in one ablation study . [11] A loss function for unitary-invariant dissimilarity between word embeddings was found to be minimized in high dimensions.[12]

## Data mining

In data mining , the curse of dimensionality refers to a data set with too many features.

Genetic mutations in individuals data set

Consider the first table, which depicts 200 individuals and 2000 genes (features) with a 1 or 0 denoting whether or not they have a genetic mutation in that gene. A data mining application

| Individual name   | Gene 1   | Gene 2   | ...   | Gene 2000   |
|-------------------|----------|----------|-------|-------------|
| Individual 1      | 1        | 0        | . . . | 1           |
| . . .             | . . .    | . . .    | . . . | . . .       |
| Individual 200    | 0        | 1        | . . . | 1           |

to this data set may be finding the correlation between specific genetic mutations and creating a classification algorithm such as a decision tree to determine whether an individual has cancer or not.

A common practice of data mining in this domain would be to create association rules between genetic mutations that lead to the development of cancers. To do this, one would have to loop through each genetic mutation of each individual and find other genetic mutations that occur over a desired threshold and create pairs. They would start with pairs of two, then three, then four until they result in an

Growth of association pair permutations as pair size grows

|   Number of pairs | Calculation for permutations   | Number of permutations calculated for each row   |
|-------------------|--------------------------------|--------------------------------------------------|
|                 2 |                                | 3 998 000                                        |
|                 3 |                                | 7 988 004 000                                    |
|                 4 |                                | 15 952 043 988 000                               |
|                 5 |                                | 31 840 279 800 048 000                           |

empty set of pairs. The complexity of this algorithm can lead to calculating all permutations of gene pairs for each individual or row . Given the formula for calculating the permutations of n items with a group size of r is: , calculating the number of three pair permutations of any given individual would be

7988004000 different pairs of genes to evaluate for each individual. The number of pairs created will grow by an order of factorial as the size of the pairs increase. The growth is depicted in the permutation table (see right).

As we can see from the permutation table above, one of the major problems data miners face regarding the curse of dimensionality is that the space of possible parameter values grows exponentially or factorially as the number of features in the data set grows. This problem critically affects both computational time and space when searching for associations or optimal features to consider .

Another problem data miners may face when dealing with too many features is that the number of false predictions or classifications tends to increase as the number of features grows in the data set. In terms of the classification problem discussed above, keeping every data point could lead to a higher number of false positives and false negatives in the model.

This may seem counterintuitive, but consider the genetic mutation table from above, depicting all genetic mutations for each individual. Each genetic mutation, whether they correlate with cancer or not, will have some input or weight in the model that guides the decision-making process of the algorithm. There may be mutations that are outliers or ones that dominate the overall distribution of genetic mutations when in fact they do not correlate with cancer . These features may be working against one's model, making it more difficult to obtain optimal results.

This problem is up to the data miner to solve, and there is no universal solution. The first step any data miner should take is to explore the data, in an attempt to gain an understanding of how it can be used to solve the problem. One must first understand what the data means, and what they are trying to discover before they can decide if anything must be removed from the data set. Then they can create or use a feature selection or dimensionality reduction algorithm to remove samples or features from the data set if they deem it necessary . One example of such methods is the interquartile range method, used to remove outliers in a data set by calculating the standard deviation of a feature or occurrence.

## Distance function

When a measure such as a Euclidean distance is defined using many coordinates, there is little difference in the distances between different pairs of points.

One way to illustrate the "vastness" of high-dimensional Euclidean space is to compare the proportion of an inscribed hypersphere with radius and dimension , to that of a hypercube with edges of length

The volume of such a sphere is , w here is the gamma function , w hile the volume of the cube is . As the dimension of the space increases, the hypersphere becomes an insignificant volume relative to that of the hypercube. This can clearly be seen by comparing the proportions as the dimension goes to infinity:

<!-- formula-not-decoded -->

Furthermore, the distance between the center and the corners is , w hich increases without bound for fixed r .

In this sense when points are uniformly generated in a high-dimensional hypercube, almost all points are much farther than units away from the centre. In high dimensions, the volume of the d-dimensional unit hypercube (with coordinates of the vertices ) is concentrated near a sphere with the radius for large dimension d. Indeed, for each coordinate the average value of in the cube is [13]

<!-- formula-not-decoded -->

The variance of for uniform distribution in the cube is

Therefore, the squared distance from the origin, has the average value d/3 and variance 4d/45. For large d , distribution of is close to the normal distribution with the mean 1/3 and the standard deviation according to the central limit theorem . Thus, when uniformly generating points in high dimensions, both the "middle" of the hypercube, and the corners are empty, y, and all the volume is concentrated near the surface of a sphere of "intermediate" radius .

This also helps to understand the chi-squared distribution . Indeed, the (non-central) chi-squared distribution associated to a random point in the interval [-1, 1] is the same as the distribution of the length-squared of a random point in the d-cube. By the law of large numbers, this distribution concentrates itself in a narrow band around d times the standard deviation squared (σ 2 ) of the original derivation. This illuminates the chi-squared distribution and also illustrates that most of the volume of the d-cube concentrates near the boundary of a sphere of radius .

A further development of this phenomenon is as follows. Any fixed distribution on the real numbers induces a product distribution on points in . For any fixed n, it turns out that the difference between the minimum and the maximum distance between a random reference point Q and a list of n random data points P1 ,..., P n become indiscernible compared to the minimum distance: [14]

<!-- formula-not-decoded -->

This is often cited as distance functions losing their usefulness (for the nearest-neighbor criterion in feature-comparison algorithms, for example) in high dimensions. However , recent research has shown this to only hold in the artificial scenario when the one-dimensional distributions are independent and identically distributed . [15] When attributes are correlated, data can become easier and provide higher distance contrast and the signal-to-noise ratio was found to play an important role, thus feature selection should be used.[15]

More recently, y, it has been suggested that there may be a conceptual flaw in the argument that contrastloss creates a curse in high dimensions. Machine learning can be understood as the problem of assigning instances to their respective generative process of origin, with class labels acting as symbolic representations of individual generative processes. The curse's derivation assumes all instances are independent, identical outcomes of a single high dimensional generative process. If there is only one generative process, there would exist only one (naturally occurring) class and machine learning would be conceptually ill-defined in both high and low dimensions. Thus, the traditional argument that contrastloss creates a curse, may be fundamentally inappropriate. In addition, it has been shown that when the generative model is modified to accommodate multiple generative processes, contrast-loss can morph from a curse to a blessing, as it ensures that the nearest-neighbor of an instance is almost-surely its most closely related instance. From this perspective, contrast-loss makes high dimensional distances especially meaningful and not especially non-meaningful as is often argued. [16]

## Nearest neighbor search

The effect complicates nearest neighbor search in high dimensional space. It is not possible to quickly reject candidates by using the difference in one coordinate as a lower bound for a distance based on all the dimensions.[17][18]

However , it has recently been observed that the mere number of dimensions does not necessarily result in difficulties, [19] since relevant additional dimensions can also increase the contrast. In addition, for the resulting ranking it remains useful to discern close and far neighbors. Irrelevant ("noise") dimensions, however , reduce the contrast in the manner described above. In time series analysis , where the data are inherently high-dimensional, distance functions also work reliably as long as the signal-to-noise ratio is high enough. [20]

## k-nearest neighbor classification

Another effect of high dimensionality on distance functions concerns k-nearest neighbor (k-NN) graphs constructed from a data set using a distance function. As the dimension increases, the indegree distribution of the k-NN digraph becomes skewed with a peak on the right because of the emergence of a disproportionate number of hubs , that is, data-points that appear in many more k-NN lists of other datapoints than the average. [21] This phenomenon can have a considerable impact on various techniques for classification (including the k-NN classifier), semi-supervised learning , and clustering , [22] and it also affects information retrieval . [23]

## Anomaly detection

In a 2012 survey, y, Zimek et al. identified the following problems when searching for anomalies in highdimensional data:[15]

1. Concentration of scores and distances: derived values such as distances become numerically similar
2. Irrelevant attributes: in high dimensional data, a significant number of attributes may be irrelevant
3. Definition of reference sets: for local methods, reference sets are often nearest-neighbor based
4. Incomparable scores for different dimensionalities: different subspaces produce incomparable scores
5. Interpretability of scores: the scores often no longer convey a semantic meaning
6. Exponential search space: the search space can no longer be systematically scanned
7. Data snooping bias: given the large search space, for every desired significance a hypothesis can be found
8. Hubness: certain objects occur more frequently in neighbor lists than others.

Many of the analyzed specialized methods tackle one or another of these problems, but there remain many open research questions.

## Blessing of dimensionality

Surprisingly and despite the expected "curse of dimensionality" difficulties, common-sense heuristics based on the most straightforward methods "can yield results which are almost surely optimal" for highdimensional problems. [24] The term "blessing of dimensionality" was introduced in the late 1990s.[ 24] Donoho in his "Millennium manifesto" clearly explained why the "blessing of dimensionality" will form a basis of future data mining. [25] The effects of the blessing of dimensionality were discovered in many applications and found their foundation in the concentration of measure phenomena . [26] One example of the blessing of dimensionality phenomenon is linear separability of a random point from a large finite random set with high probability even if this set is exponentially large: the number of elements in this random set can grow exponentially with dimension. Moreover , this linear functional can be selected in the form of the simplest linear Fisher discriminant . This separability theorem was proven for a wide class of probability distributions: general uniformly log-concave distributions, product distributions in a cube and many other families (reviewed recently in [26] ).

"The blessing of dimensionality and the curse of dimensionality are two sides of the same coin." [27] For example, the typical property of essentially high-dimensional probability distributions in a highdimensional space is: the squared distance of random points to a selected point is, with high probability, y, close to the average (or median) squared distance. This property significantly simplifies the expected geometry of data and indexing of high-dimensional data (blessing), [28] but, at the same time, it makes the similarity search in high dimensions difficult and even useless (curse). [29]

Zimek et al.[15] noted that while the typical formalizations of the curse of dimensionality affect i.i.d. data, having data that is separated in each attribute becomes easier even in high dimensions, and argued that the signal-to-noise ratio matters: data becomes easier with each attribute that adds signal, and harder with attributes that only add noise (irrelevant error) to the data. In particular for unsupervised data analysis this effect is known as swamping.

## See also

- Bellman equation
- Clustering high-dimensional data
- Concentration of measure
- Dimensionality reduction
- Dynamic programming
- Fourier-related transforms
- Grand Tour
- Linear least squares
- Model order reduction
- Multilinear PCA
- Multilinear subspace learning
- Principal component analysis
- Singular value decomposition

## References

1. Bellman, Richard Ernest; Rand Corporation (1957). Dynamic programming (https://books.go ogle.com/books?id=wdtoPwAACAAJ). Princeton University Press. p. ix. ISBN 978-0-69107951-6 . ,
2. Republished: Bellman, Richard Ernest (2003). Dynamic Programming (https://books.google. com/books?id=fyVtp3EMxasC). Courier Dover Publications. ISBN 978-0-486-42809-3 .
2. Bellman, Richard Ernest (1961). Adaptive control processes: a guided tour (https://books.go ogle.com/books?id=POAmAAAAMAAJ). Princeton University Press. ISBN 9780691079011 .
3. Taylor, C. Robert (1993). "Dynamic Programming and the Curses of Dimensionality" (https:// books.google.com/books?id=71SsDwAAQBAJ&amp;pg=PA1) . A Applications Of Dynamic Programming To Agricultural Decision Problems. Westview Press. pp. 1–10. ISBN 0-81338641-1 .
4. Udacity (2015-02-23). "Curse of Dimensionality - Georgia Tech - Machine Learning" (https:// www.youtube.com/watch?v=QZ0DtNFdDko) . YouTube. Retrieved 2022-06-29 .
5. Koutroumbas, Konstantinos; Theodoridis, Sergios (2008). Pattern Recognition (https://www . elsevier.com/books/pattern-recognition/theodoridis/978-1-59749-272-0) (4th ed.). Burlington. ISBN 978-1-59749-272-0. Retrieved 2018-01-08 .
6. Hughes, G.F. (January 1968). "On the mean accuracy of statistical pattern recognizers". IEEE Transactions on Information Theory . 14 (1): 55–63. doi:10.1109/TIT.1968.1054102 (htt ps://doi.org/10.1109%2FTIT.1968.1054102) . S2CID 206729491 (https://api.semanticscholar . org/CorpusID:206729491) .
7. Trunk, G. V. (July 1979). "A Problem of Dimensionality: A Simple Example". IEEE Transactions on Pattern Analysis and Machine Intelligence. PAMI-1 (3): 306–307. doi:10.1109/TPAMI.1979.4766926 (https://doi.org/10.1109%2FTPAMI.1979.4766926) . PMID 21868861 (https://pubmed.ncbi.nlm.nih.gov/21868861) . S2CID 13086902 (https://api. semanticscholar.org/CorpusID:13086902) .
8. B. Chandrasekaran; A. K. Jain (1974). "Quantization Complexity and Independent Measurements". IEEE Transactions on Computers . 23 (8): 102–106. doi:10.1109/TC.1974.223789 (https://doi.org/10.1109%2FT-C.1974.223789) . S2CID 35360973 (https://ap i.semanticscholar.org/CorpusID:35360973) .
9. McLachlan, G. J. (2004). Discriminant Analysis and Statistical Pattern Recognition. Wiley Interscience. ISBN 978-0-471-69115-0 . MR 1190469 (https://mathscinet.ams.org/mathscine t-getitem?mr=1190469) .
10. Zollanvari, A.; James, A. P.; Sameni, R. (2020). "A Theoretical Analysis of the Peaking Phenomenon in Classification". Journal of Classification . 37 (2): 421–434. doi:10.1007/s00357-019-09327-3 (https://doi.org/10.1007%2Fs00357-019-09327-3) . S2CID 253851666 (https://api.semanticscholar.org/CorpusID:253851666) .
11. Schroff, Florian; Kalenichenko, Dmitry; Philbin, James (June 2015). "FaceNet: A unified embedding for face recognition and clustering" (https://www.cv-foundation.org/openaccess/c ontent\_cvpr\_2015/papers/Schroff\_FaceNet\_A\_Unified\_2015\_CVPR\_paper.pdf) (PDF) . 2015 IEEE Conference on Computer Vision and Pattern Recognition (CVPR). pp. 815–823. arXiv:1503.03832 (https://arxiv.org/abs/1503.03832) . doi:10.1109/CVPR.2015.7298682 (http s://doi.org/10.1109%2FCVPR.2015.7298682) . ISBN 978-1-4673-6964-0 . S2CID 206592766 (https://api.semanticscholar.org/CorpusID:206592766) .
12. Yin, Zi; Shen, Yuanyuan (2018). "On the Dimensionality of Word Embedding" (https://procee dings.neurips.cc/paper\_files/paper/2018/file/b534ba68236ba543ae44b22bd110a1d6-Paper . pdf) (PDF) . A Advances in Neural Information Processing Systems . 31. Curran Associates, Inc.
13. Bailey, D.H.; Borwein, J.M.; Crandall, R.E. (2006), "Box integrals", Journal of Computational and Applied Mathematics , 206: 196–208, doi:10.1016/j.cam.2006.06.010 (https://doi.org/10. 1016%2Fj.cam.2006.06.010) , S2CID 2763194 (https://api.semanticscholar.org/CorpusID:27 63194)
14. Beyer, K.; Goldstein, J.; Ramakrishnan, R.; Shaft, U. (1999). "When is "Nearest Neighbor" Meaningful?". Database Theory — ICDT'99 (http://digital.library.wisc.edu/1793/60174) . LNCS. Vol. 1540. pp. 217–235. doi:10.1007/3-540-49257-7\_15 (https://doi.org/10.1007%2F 3-540-49257-7\_15) . ISBN 978-3-540-65452-0 . S2CID 206634099 (https://api.semanticschol ar.org/CorpusID:206634099) .
15. Zimek, A.; Schubert, E.; Kriegel, H.-P . (2012). "A survey on unsupervised outlier detection in high-dimensional numerical data". Statistical Analysis and Data Mining . 5 (5): 363–387. doi:10.1002/sam.11161 (https://doi.org/10.1002%2Fsam.11161) . S2CID 6724536 (https://ap i.semanticscholar.org/CorpusID:6724536) .
16. Lin, Wen-Yan; Liu, Siying; Ren, Changhao; Cheung, Ngai-Man; Li, Hongdong; Matsushita, Yasuyuki (2021). "Shell Theory: A Statistical Model of Reality" (https://ieeexplore.ieee.org/do cument/9444188) . IEEE Transactions on Pattern Analysis and Machine Intelligence . 44 (10): 6438–6453. doi:10.1109/TPAMI.2021.3084598 (https://doi.org/10.1109%2FTPAMI.2021.308 4598) . ISSN 1939-3539 (https://search.worldcat.org/issn/1939-3539) . PMID 34048335 (http s://pubmed.ncbi.nlm.nih.gov/34048335) . S2CID 235242104 (https://api.semanticscholar.org/ CorpusID:235242104) .
17. Marimont, R.B.; Shapiro, M.B. (1979). "Nearest Neighbour Searches and the Curse of Dimensionality". IMA J Appl Math . 24 (1): 59–70. doi:10.1093/imamat/24.1.59 (https://doi.or g/10.1093%2Fimamat%2F24.1.59) .
18. Chávez, Edgar; Navarro, Gonzalo; Baeza-Yates, Ricardo; Marroquín, José Luis (2001). "Searching in Metric Spaces". ACM Computing Surveys . 33 (3): 273–321. CiteSeerX 10.1.1.100.7845 (https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.100. 7845) . doi:10.1145/502807.502808 (https://doi.org/10.1145%2F502807.502808) . S2CID 3201604 (https://api.semanticscholar.org/CorpusID:3201604) .
19. Houle, M. E.; Kriegel, H. P . ; Kröger, P.; Schubert, E.; Zimek, A. (2010). Can SharedNeighbor Distances Defeat the Curse of Dimensionality? (http://www.dbs.ifi.lmu.de/~zimek/p ublications/SSDBM2010/SNN-SSDBM2010-preprint.pdf) (PDF). Scientific and Statistical Database Management. Lecture Notes in Computer Science. Vol. 6187. p. 482. doi:10.1007/978-3-642-13818-8\_34 (https://doi.org/10.1007%2F978-3-642-13818-8\_34) . ISBN 978-3-642-13817-1 .
20. Bernecker , T.; Houle, M. E.; Kriegel, H. P . ; Kröger, P.; Renz, M.; Schubert, E.; Zimek, A. (2011). Quality of Similarity Rankings in Time Series. Symposium on Spatial and Temporal Databases. Lecture Notes in Computer Science. Vol. 6849. p. 422. doi:10.1007/978-3-64222922-0\_25 (https://doi.org/10.1007%2F978-3-642-22922-0\_25) . ISBN 978-3-642-22921-3 .
21. James, Gareth; Witten, Daniela; Hastie, Trevor; Tibshirani, Robert (2021). An introduction to statistical learning: with applications in R (https://link.springer.com/book/10.1007/978-1-0716 -1418-1) (Second ed.). New York, NY: Springer. p. 122. ISBN 978-1-0716-1418-1. Retrieved 1 November 2024 .
22. Radovanović, Miloš; Nanopoulos, Alexandros; Ivanović, Mirjana (2010). "Hubs in space: Popular nearest neighbors in high-dimensional data" (http://www.jmlr.org/papers/volume11/r adovanovic10a/radovanovic10a.pdf) (PDF) . Journal of Machine Learning Research . 11: 2487–2531.
23. Radovanović, M.; Nanopoulos, A.; Ivanović, M. (2010). On the existence of obstinate results in vector space models. 33rd international ACM SIGIR conference on Research and development in information retrieval - SIGIR '10. p. 186. doi:10.1145/1835449.1835482 (http s://doi.org/10.1145%2F1835449.1835482) . ISBN 9781450301534 .
24. Kainen, Paul C. (1997), "Utilizing Geometric Anomalies of High Dimension: When Complexity Makes Computation Easier", in Kárný, M.; Warwick, K. (eds.), Computer Intensive Methods in Control and Signal Processing, pp. 283–294, doi:10.1007/978-1-46121996-5\_18 (https://doi.org/10.1007%2F978-1-4612-1996-5\_18) , ISBN 978-1-4612-7373-8
25. Donoho, David L. (2000), "High-Dimensional Data Analysis: The Curses and Blessings of Dimensionality", Invited lecture at Mathematical Challenges of the 21st Century, y, A AMS National Meeting, Los Angeles, CA, USA, August 6-12, 2000 , CiteSeerX 10.1.1.329.3392 (h ttps://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.329.3392)
26. Gorban, Alexander N.; Makarov, Valery A.; Tyukin, Ivan Y. (2020). "High-Dimensional Brain in a High-Dimensional World: Blessing of Dimensionality" (https://www.ncbi.nlm.nih.gov/pm c/articles/PMC7516518) . Entropy . 22 (1): 82. arXiv:2001.04959 (https://arxiv.org/abs/2001.0 4959) . Bibcode:2020Entrp..22...82G (https://ui.adsabs.harvard.edu/abs/2020Entrp..22...82 G) . doi:10.3390/e22010082 (https://doi.org/10.3390%2Fe22010082) . PMC 7516518 (https:// www.ncbi.nlm.nih.gov/pmc/articles/PMC7516518) . PMID 33285855 (https://pubmed.ncbi.nl m.nih.gov/33285855) .
27. Gorban, Alexander N.; Tyukin, Ivan Y. (2018). "Blessing of dimensionality: mathematical foundations of the statistical physics of data" (https://www.ncbi.nlm.nih.gov/pmc/articles/PM C5869543) . Phil. Trans. R. Soc. A . 376 (2118): 20170237. arXiv:1801.03421 (https://arxiv.or g/abs/1801.03421) . Bibcode:2018RSPTA.37670237G (https://ui.adsabs.harvard.edu/abs/20 18RSPTA.37670237G) . doi:10.1098/rsta.2017.0237 (https://doi.org/10.1098%2Frsta.2017.0 237) . PMC 5869543 (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5869543) . PMID 29555807 (https://pubmed.ncbi.nlm.nih.gov/29555807) .
28. Hecht-Nielsen, Robert (1994), "Context vectors: general-purpose approximate meaning representations self-organized from raw data", in Zurada, J.M.; Marks, R.J.; Robinson, C.J. (eds.), Computational intelligence: imitating life; Proceedings of World Congress on Computational Intelligence, Neural Networks; 1994; Orlando; FL, Piscataway, NJ: IEEE Press, pp. 43–56, ISBN 0780311043
29. Pestov, Vladimir (2013). "Is the k-NN classifier in high dimensions affected by the curse of dimensionality?" (https://doi.org/10.1016%2Fj.camwa.2012.09.011) . Comput. Math. Appl . 65 (10): 43–56. doi:10.1016/j.camwa.2012.09.011 (https://doi.org/10.1016%2Fj.camwa.2012.0 9.011) .

Retrieved from " https://en . wikipedia . org/w/index . php?title=Curse \_ of \_ dimensionality&amp;oldid=1275834637 "