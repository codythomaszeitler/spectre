to_convert=$(find templates -type f -maxdepth 1)
rm -rf templates/converted
mkdir -p templates/converted

while read line; do
    contents=$(cat "$line")
    json_file_contents=$(echo "export const contents = { \"contents\" : \"$contents\" }")
    file_name=$(basename $line)
    echo "$json_file_contents" | tee templates/converted/$file_name.ts
done <<< "$to_convert"