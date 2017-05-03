library(rjson)
library(argparse)

main <- function(ac, av) {
  parser <- ArgumentParser(description='Borderline R wrapper script')
  parser$add_argument("-i", "--input", dest="inputs", type="character", action="append", help="Input file")
  parser$add_argument("-s", "--script", dest="script", type="character", required=TRUE, help="User script file to run")
  parser$add_argument("-p", "--params", dest="params", type="character", default='{ "isDefault": true }', help="Configuration parameters in JSON format")
  args <- parser$parse_args(av);

  #Parse JSON input to native R data structure
  args$params <- fromJSON(args$params);
  #Import input script file
  source(args$script);
  #Call user script
  borderlineJob(args$params, args$inputs);
}


#Getting command line arguments
cmdArgs <- commandArgs(trailingOnly = TRUE);
##Passing that to a c-like main function
#main(length(cmdArgs), cmdArgs)
main(42, c("-s", "template.R", "-i", "test1.csv", "-i", "test2.csv"));
