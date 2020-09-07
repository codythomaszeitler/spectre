
header = 'Charge Amount,Bank,Place of Business\n'


banks = ['Wells Fargo', 'Bank of America', 'Chase']
buisnesses = ['"Jack in\\n the box"', '"Mcdon\\nalds"', '"Wen\\ndys"', '"Apple\\n Store"', '"Microsoft\\n Store"']

contents = ''
num_rows = 8888
for i in range(num_rows):

    bank = banks[i % len(banks)]
    buisness = buisnesses[i % len(buisnesses)]

    contents += '$' + str(i) + '.25,' + bank + ',' + buisness + '\n' 

full = header + contents
print (full)

with open('generated.csv', 'w+') as f:
    f.write(full)


