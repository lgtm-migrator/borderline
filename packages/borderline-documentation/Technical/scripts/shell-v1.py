#!/bin/python2.7

import sys, os, imp
import argparse
import json

def main():
    parser = argparse.ArgumentParser(description='Borderline R wrapper script')
    parser.add_argument("-i", "--input", dest="inputs", action="append", help="Input file")
    parser.add_argument("-s", "--script", dest="script", required=True, help="User script file to run")
    parser.add_argument("-p", "--params", dest="params", default='{ "isDefault": true }', help="Configuration parameters in JSON format")
    args = parser.parse_args()

    jsonParams = json.loads(args.params)
    script = imp.load_source('', args.script)
    script.borderline_job(jsonParams, args.inputs)


if __name__ == "__main__":
    main()
