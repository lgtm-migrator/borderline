borderlineJob <- function (formData, inputFiles) {
  print("Borderline - Job");
  
  print("Form input data is:");
  print(formData);
  
  print("Available data files are: ");
  print(inputFiles);
  
  print("Available R packages:");
  printf(rownames(installed.packages()));
}
