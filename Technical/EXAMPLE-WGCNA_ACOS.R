#----------------------------------------------#
# WGCNA Analysis on UBIOPRED AND ECLIPSE ACOS
#----------------------------------------------#

library(WGCNA);
options(stringsAsFactors = FALSE);
#enableWGCNAThreads()

read_ubio_clinical <- function(){
  df = read.table("C://Users//ks709//Desktop//ECLIPSE//ACOS//WGCNA//ubio_clinical_for_WGCNA.txt",
                  sep = "\t", na.strings = "")
  colnames(df) <- df[1, ]
  df = df[-1, ]
  
  acos.map <- -1:2
  names(acos.map) <- c("NA","Healthy_Control", "ACOS_Subject", "Non_ACOS_Asthmatic")
  df$ACOS<-acos.map[df$ACOS]
  
  gender.map <- 0:1
  names(gender.map) <- c("female", "male")
  df$Sex <- gender.map[df$Sex]
  
  cohort.map <- 0:4
  names(cohort.map) <- c("cohort_v", "cohort_a", "cohort_b", "cohort_c", "cohort_d")
  df$Cohort <- cohort.map[df$Cohort]
  return(df)
  
}

read_ecli_clinical <- function(){
  df = read.table("C://Users//ks709//Desktop//ECLIPSE//ACOS//WGCNA//ecli_clinical_for_WGCNA.txt",
                  sep = "\t", na.strings = "")
  colnames(df) <- df[1, ]
  df = df[-1, ]
  
  acos.map <- -1:3
  names(acos.map) <- c("NA","Non_Smoker_Control", "Smoker_Control", "ACOS_Subject", "Non_ACOS_COPD_Subject")
  df$ACOS<-acos.map[df$ACOS]
  
  gender.map <- 0:1
  names(gender.map) <- c("Female", "Male")
  df$Sex <- gender.map[df$Sex]
  
  cohort.map <- 0:2
  names(cohort.map) <- c("COPD Subjects", "Smoker Controls", "Non-smoker Controls")
  df$Cohort <- cohort.map[df$Cohort]
  return(df)
  
}


df_clinical <- read_ubio_clinical()
#df_clinical <- read_ecli_clinical()

df_clinical$`IL17 (Serum)` <- NULL
df_clinical$`Monocytes Pct (Blood)` <- NULL
df_clinical$`Basophils (Blood)` <- NULL


df_omics_mapping = read.table("C://Users//ks709//Desktop//ECLIPSE//ACOS//WGCNA//OMICS_files//subject_2_sample_mapping.txt",
                              sep = "\t", na.strings = ".", header = TRUE, as.is = TRUE)
df_omics_mapping <- df_omics_mapping[, c("subject_id", "SAMPLE_ID")]


df_expression <- as.matrix(read.table("C://Users//ks709//Desktop//ECLIPSE//ACOS//WGCNA//OMICS_files//OMICS_SpuTrans_raw_updated.txt", header = TRUE, 
                              sep = "\t", row.names = 1, as.is = TRUE))
#df_expression <- as.matrix(read.table("C://Users//ks709//Desktop//ECLIPSE//ACOS//WGCNA//OMICS_files//OMICS_cu_blood_expression.txt", header = TRUE, 
#                                      sep = "\t", na.strings = ".", row.names = 1, as.is = TRUE))
#df_expression <- as.matrix(read.table("C://Users//ks709//Desktop//ECLIPSE//ACOS//WGCNA//OMICS_files//OMICS_cu_sputum_expression.txt", header = TRUE, 
#                                      sep = "\t", na.strings = ".", row.names = 1, as.is = TRUE))

df_expression <- log2(df_expression)

colnames <- as.data.frame(colnames(df_expression))
colnames(colnames) <- "Sample_ID"
colnames <- merge(colnames, df_omics_mapping, by.x = "Sample_ID", by.y = "SAMPLE_ID", all = FALSE )
colnames(df_expression) <- colnames$subject_id
df_t_expression <- t(df_expression)

gsg = goodSamplesGenes(df_t_expression, verbose = 3);

# Remove the offending genes and samples from the data:
if (!gsg$allOK)
{
  # Optionally, print the gene and sample names that were removed:
  if (sum(!gsg$goodGenes) > 0)
    printFlush(paste("Removing genes:", paste(names(df_t_expression)[!gsg$goodGenes], collapse = ", ")));
  if (sum(!gsg$goodSamples)>0)
    printFlush(paste("Removing samples:", paste(rownames(df_t_expression)[!gsg$goodSamples], collapse = ", ")));
  # Remove the offending genes and samples from the data:
  df_t_expression = df_t_expression[gsg$goodSamples, gsg$goodGenes]
}

df_annotation = read.table("C://Users//ks709//Desktop//ECLIPSE//ACOS//WGCNA//OMICS_files//platform_annotation_GPL570_U.txt",
                           sep = "\t", na.strings = ".", header = TRUE, as.is = TRUE)
#df_annotation = read.table("C://Users//ks709//Desktop//ECLIPSE//ACOS//WGCNA//OMICS_files//platform_annotation_GPL570_E.txt",
#                           sep = "\t", na.strings = ".", header = TRUE, as.is = TRUE)


mappable_probes <- df_annotation$PROBE_ID[!is.na(df_annotation$GENE_ID)]

df_filtered_t_expression <- df_t_expression[rownames(df_t_expression) %in% df_clinical$Subject_ID, colnames(df_t_expression) %in% mappable_probes] 


sampleTree = hclust(dist(df_filtered_t_expression), method = "average");

samples = rownames(df_filtered_t_expression);
traitRows = match(samples, df_clinical$Subject_ID);
datTraits = df_clinical[traitRows, -1];
rownames(datTraits) = df_clinical[traitRows, 1];
collectGarbage();
datTraits <- as.data.frame(lapply(datTraits, as.numeric))



# Convert traits to a color representation: white means low, red means high, grey means missing entry
traitColors = numbers2colors(datTraits, signed = FALSE);

png(filename = "C://Users//ks709//Desktop//ECLIPSE//ACOS//WGCNA//Results/dendrogram.png",
    width = 30, height = 20, units = 'in', res = 300)
# Plot the sample dendrogram and the colors underneath.
plotDendroAndColors(sampleTree, traitColors, groupLabels = names(datTraits),
                    main = "Sample dendrogram and trait heatmap")
dev.off()


# Choose a set of soft-thresholding powers
powers = c(c(1:10), seq(from = 12, to = 20, by = 2))
# Call the network topology analysis function
sft = pickSoftThreshold(df_filtered_t_expression, powerVector = powers, verbose = 5)
# Plot the results:
sizeGrWindow(9, 5)
par(mfrow = c(1,2));
cex1 = 0.9;
# Scale-free topology fit index as a function of the soft-thresholding power
plot(sft$fitIndices[,1], -sign(sft$fitIndices[,3])*sft$fitIndices[,2],
     xlab="Soft Threshold (power)",ylab="Scale Free Topology Model Fit,signed R^2",type="n",
     main = paste("Scale independence"));
text(sft$fitIndices[,1], -sign(sft$fitIndices[,3])*sft$fitIndices[,2],
     labels=powers,cex=cex1,col="red");
# this line corresponds to using an R^2 cut-off of h
abline(h=0.90,col="red")
# Mean connectivity as a function of the soft-thresholding power
plot(sft$fitIndices[, 1], sft$fitIndices[, 5],
     xlab="Soft Threshold (power)",ylab="Mean Connectivity", type="n",
     main = paste("Mean connectivity"))
text(sft$fitIndices[,1], sft$fitIndices[,5], labels=powers, cex=cex1,col="red")

ubio_base_sputum_power = 7
ubio_base_blood_power = 9


#ecli_base_blood_power = 6
ecli_base_blood_power = 16

# Block-wise network construction and module detection
bwnet = blockwiseModules(df_filtered_t_expression, maxBlockSize = 2000,
                                          power = ubio_base_sputum_power, TOMType = "unsigned", minModuleSize = 30,
                                          reassignThreshold = 0, mergeCutHeight = 0.25,
                                          numericLabels = TRUE,
                                          saveTOMs = TRUE,
                                          saveTOMFileBase = "ubio_base_sputum-blockwise",
                                          verbose = 3)


# open a graphics window
sizeGrWindow(12, 9)
# Convert labels to colors for plotting
ModuleColors = labels2colors(bwnet$colors)
# Plot the dendrogram and the module colors underneath

for (block in 1:length(bwnet$dendrograms)){
  png(filename = paste("C://Users//ks709//Desktop//ECLIPSE//ACOS//WGCNA//Results//ubio_sputum_module_", block, ".png", sep = ""),
    width = 8, height = 5, units = 'in', res = 300)
  plotDendroAndColors(bwnet$dendrograms[[block]], ModuleColors[bwnet$blockGenes[[block]]],
                    main = paste("Gene dendrogram and module colors in block", block),
                    "Module colors", dendroLabels = FALSE, hang = 0.03, addGuide = TRUE, guideHang = 0.05)
  dev.off()
}


newdatTraits <- datTraits
newdatTraits$ACOS_NonACOS <- newdatTraits$ACOS
newdatTraits$ACOS_HC <- newdatTraits$ACOS
newdatTraits$NonACOS_HC <- newdatTraits$ACOS
newdatTraits$ACOS <- NULL

newdatTraits$ACOS_NonACOS[newdatTraits$ACOS_NonACOS == 0] <- NA
newdatTraits$ACOS_HC[newdatTraits$ACOS_HC == 2] <- NA
newdatTraits$NonACOS_HC[newdatTraits$NonACOS_HC == 1] <- NA

# Define numbers of genes and samples
nGenes = ncol(df_filtered_t_expression);
nSamples = nrow(df_filtered_t_expression);
# Recalculate MEs with color labels
MEs0 = moduleEigengenes(df_filtered_t_expression, ModuleColors)$eigengenes
MEs = orderMEs(MEs0)
moduleTraitCor = cor(MEs, newdatTraits, use = "p");
moduleTraitPvalue = corPvalueStudent(moduleTraitCor, nSamples);

sizeGrWindow(10,6)


probes = colnames(df_filtered_t_expression)
probe2annot = match(probes, df_annotation$PROBE_ID)
allGenes =df_annotation$GENE_SYMBOL[probe2annot]

module = 'greenyellow'
modProbes = (ModuleColors == module)
modGenes = allGenes[modProbes]
filename = paste("C://Users//ks709//Desktop//ECLIPSE//ACOS//WGCNA//Results//genelist_", module, ".txt", sep = "")
write.table(as.data.frame(modGenes), file = filename, row.names = FALSE, col.names = FALSE)

