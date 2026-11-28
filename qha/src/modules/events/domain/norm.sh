for f in *.ts; do
  l=$(echo "$f" | tr 'A-Z' 'a-z')
  if [ "$f" != "$l" ]; then mv "$f" "$l"; fi
done
