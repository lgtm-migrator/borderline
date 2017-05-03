#!/bin/python2.7

import sys, os

def borderline_job(formData, inputFiles):
    print("Borderline - Job")

    print("Form input data is:")
    print(formData)

    print("Available data files are: ")
    print(inputFiles)

    print("Available python modules:")
    print(sys.modules.keys())