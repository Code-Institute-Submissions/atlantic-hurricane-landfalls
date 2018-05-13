
# Atlantic Hurricane Landfalls 1950-2015

This project aims to provide a data visualization for all the atlantic hurricanes that made landfall between 1950 and 2015.The methodology and code is also included on the website so as to make the project reproducible.

## Raw Data Source
The raw data was sourced from kaggle
[Link to raw Data]("https://www.kaggle.com/noaa/hurricane-database/data")

## Code For Cleaning the Data
The data was cleaned with numpy and pandas.These don't work very well with the cloud9 IDE currently so it was done in spyder.
```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun May  6 13:45:32 2018

@author: annegill
"""
#import numpy and pandas
import pandas as pd
import numpy as np

#read in csv
df = pd.read_csv('/Downloads/hurricanes-and-typhoons-1851-2014/atlantic.csv')
#select rows
to_drop = ['Minimum Pressure','Low Wind SW','Low Wind NW','Moderate Wind NE','Moderate Wind SE','Moderate Wind SW','Moderate Wind NW','High Wind NE','High Wind SE','High Wind SW','High Wind NW','Low Wind NE','Low Wind SE']
df.drop(to_drop, inplace=True, axis=1)


#strip whitespace from Names
extr = df['Name'].str.strip()


df['Name']=extr

df1=df[df.Name != 'UNNAMED']
#extract all landfall events
df2=df1[df1.Event == ' L']




#create category column
def getcategory(windspeed):
    if windspeed >= 157:
        return 'CAT 5' 
    elif windspeed >=130:
        return 'CAT 4'
    elif windspeed >=111:
        return 'CAT 3'
    elif windspeed >=96:
        return 'CAT 2'
    elif windspeed >=74:
        return 'CAT 1'
    elif windspeed >=39:
        return 'TS'
    else:
        return 'TD'
    
df2['MAX_CAT'] = df2['Maximum Wind'].apply(getcategory)
#strip whitespace from Event
extr2 = df2['Event'].str.strip()
df2['Event']=extr2


print(df2)
#get hurricane status storms
df3=df2[df2.Status == ' HU']
#save to csv
df3.to_csv('/Downloads/hurricanes-and-typhoons-1851-2014/atlantic_clean.csv')
```
## Built With

* [dc.js]() - Used for the interactive graphs
* [d3.js]() - Used for the interactive graphs
* [crossfilter]() -Used for the interactive graphs
* [leaflet]() - Used to render the map
* [bootstrap]() - Used for styling
* [flask]() - Used as framework

## Hosts
* [github]() - Hosts code and manages commits
* [heroku]() - Dependency Management
* [mlab]() - Hosts Data

## Notes

* The decision was made not to make the site responsive as the dashboard is meant to be viewed on a large screen. 


## Acknowledgments
* https://bl.ocks.org/mbostock
* http://adilmoujahid.com/posts/2016/08/interactive-data-visualization-geospatial-d3-dc-leaflet-python/
