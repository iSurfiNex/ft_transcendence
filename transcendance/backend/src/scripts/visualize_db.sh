#!/bin/bash

./manage.py graph_models --pygraphviz -a -g -o images/db.png
xdg-open images/db.png
