#!/bin/bash

npm --prefix ui install
NODE_ENV=server npm --prefix ui run build
