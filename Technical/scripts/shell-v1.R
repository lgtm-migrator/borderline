library(rjson)
library(optparse)

main <- function(ac, av) {
  optionsList <- list(
    make_option(c("-s", "--script"), dest="script", type="character", help="[Required] User script code to run"),
    make_option(c("-p", "--params"), dest="params", type="character", default="{}", help="Configuration parameters in JSON format"),
    make_option(c("-i", "--input"), dest="inputs", type="character", default="", help="Input files separated by a comma")
  );
  parser <- OptionParser(usage="Usage: %prog --script <path_to_user_script> [options]", option_list = optionsList, description="Borderline R wrapper script");
  args <- parse_args(parser, args = av);
  
  if (is.null(args$script)) {
    print_help(parser);
    quit(status = 1);
  }
  
  #Parse JSON input to native R data structure
  args$params <- fromJSON(args$params);
  
  #Parse Input file list to Native R vector
  args$inputs <- unlist(strsplit(c(args$inputs), ',', fixed=TRUE));
  
  source(args$script);
  borderlineJob(args$params, args$inputs);
}


#Getting command line arguments
cmdArgs <- commandArgs(trailingOnly = TRUE);
##Passing that to a c-like main function
main(length(cmdArgs), cmdArgs)