import pandas as pd

df=pd.read_csv('TS_FI_CAPTURE.csv')

#print(df.groupby('UNIT')['QUANTITY'].count())

groupst=df.groupby(['UNIT', 'COUNTRY','YEAR']).sum()['QUANTITY'].t
groupsv=df.groupby(['UNIT', 'COUNTRY','YEAR']).sum()['QUANTITY'].v

groupst.to_csv('t0.csv')

newt=pd.read_csv('t0.csv').pivot(index='COUNTRY', columns='YEAR', values='QUANTITY')

newt.to_csv('t.csv')

print(groups.__dict__)


groupsv.to_csv('v0.csv')

newt=pd.read_csv('v0.csv').pivot(index='COUNTRY', columns='YEAR', values='QUANTITY')

newt.to_csv('v.csv')



# for i in countryList:
#     for j in year:
#         valueTotal=sum all value
#         productionTotal=sum all production
#         valueTable.at(i,j)=sum
#         prodTable...

# write prod csv
# write value csv