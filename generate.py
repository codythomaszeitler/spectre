
header = 'Charge Amount,Bank,Place of Business\n'


banks = ['Wells Fargo', 'Bank of America', 'Chase']
buisnesses = ['Jack in the box', 'Mcdonalds', 'Wendys', 'Apple Store', 'Microsoft Store']

contents = ''
num_rows = 1000
for i in range(num_rows):
    bank = banks[i % len(banks)]
    buisness = buisnesses[i % len(buisnesses)]

    if i % 2 == 0:
        contents +=  bank + ',' + buisness + ',RANDOM' + '\n' 
    else:
        contents +=  bank + ',' + '\n'
    

full = header + contents
print (full)

with open('generated.csv', 'w+') as f:
    f.write(full)


