
header = 'Charge Amount,Bank,Place of Business\n'

contents = ''
for i in range(10):
    contents += '$400.25,Bank of America,Barros\n' 


full = header + contents
print (full)

with open('generated.csv', 'w+') as f:
    f.write(full)


