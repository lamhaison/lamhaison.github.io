function preprocess_word() {
    local word="$1"
    # Extract 
    ## 2992. yesterday adv., -> ## 2992. yesterday
    word=$(echo "$word" | sed -E 's/^(## [0-9]+\. [^ ]+)( (adv|noun|adj|prep|n\.|v\.|det\.))? (A1|A2|B1|B2)?.*/\1/' | sed -E 's/([[:alpha:]]+)[0-9]+$/\1/')
    echo "$word"
}