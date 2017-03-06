#!/bin/bash

benchmark=$1
nodepath=${2:-node}
iters=${3:-10000}
shift 3;
cwd=${PWD}

trap 'cd "$cwd"' EXIT

if [ "$benchmark" = "doxbee" ]; then
    cd "$cwd/benchmark/suite"
    npm install
    echo "Doxbee sequential"
    $nodepath performance.js --n $iters --t 1 ./doxbee-sequential/*.js --harmony "$@"
    exit 0
elif [ "$benchmark" = "doxbee-errors" ]; then
    cd "$cwd/benchmark/suite"
    npm install
    echo "Doxbee sequential with 10% errors"
    $nodepath performance.js --n $iters --t 1 --e 0.1 ./doxbee-sequential-errors/*.js --harmony "$@"
    exit 0
elif [ "$benchmark" = "parallel" ]; then
    cd "$cwd/benchmark/suite"
    npm install
    echo "Madeup parallel"
    $nodepath performance.js --n $iters --t 1 --p 25 ./madeup-parallel/*.js --harmony "$@"
    exit 0
elif [ "$benchmark" = "analysis" ]; then
    cd "$cwd/benchmark/suite"
    npm install
    echo "analysis"
    $nodepath performance.js --n $iters --t 1 ./analysis/*.js --harmony "$@"
    exit 0
else
    echo "Invalid benchmark name $benchmark"
    exit -1
fi